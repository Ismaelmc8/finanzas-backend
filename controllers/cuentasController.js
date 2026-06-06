import { Op } from "sequelize";
import { Cuenta, Banco, Transaccion, CuentaAcceso, Usuario } from "../models/Loader.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../errors/index.js";
import { generarExcel, generarCSV } from "../services/excelExportService.js";

// ─── Helper compartido ────────────────────────────────────────────────────────
// Verifica que userId tiene acceso a la cuenta con el rol mínimo requerido.
// Devuelve { cuenta, rol } donde rol es 'owner' | 'editor' | 'lector'.
export const verificarAccesoCuenta = async (userId, cuentaId, rolMinimo = "lector") => {
  const cuenta = await Cuenta.findByPk(cuentaId);
  if (!cuenta) throw new NotFoundError("Cuenta no encontrada");

  if (cuenta.userId === userId) return { cuenta, rol: "owner" };

  const acceso = await CuentaAcceso.findOne({
    where: { cuentaId, userId, estado: "aceptado" },
  });

  if (!acceso) throw new ForbiddenError("Sin acceso a esta cuenta");

  const niveles = ["lector", "editor"];
  if (niveles.indexOf(acceso.rol) < niveles.indexOf(rolMinimo)) {
    throw new ForbiddenError("Permisos insuficientes");
  }

  return { cuenta, rol: acceso.rol };
};

// ─── Balance ──────────────────────────────────────────────────────────────────
export const recalcularBalance = async (cuentaId) => {
  const ingresos  = await Transaccion.sum("total", { where: { cuentaId, type: "ingreso"  } }) || 0;
  const gastos    = await Transaccion.sum("total", { where: { cuentaId, type: "gasto"    } }) || 0;
  const traspasos = await Transaccion.sum("total", { where: { cuentaId, type: "traspaso" } }) || 0;
  await Cuenta.update({ balance: ingresos - gastos + traspasos }, { where: { id: cuentaId } });
};

// ─── CRUD cuentas ─────────────────────────────────────────────────────────────
export const crearCuenta = async (req, res, next) => {
  try {
    const { nombre, tipo, moneda, bancoId } = req.body;
    const banco = await Banco.findByPk(bancoId);
    if (!banco) throw new NotFoundError("Banco no encontrado");
    if (banco.userId !== req.user.id) throw new ForbiddenError();

    const cuenta = await Cuenta.create({ nombre, tipo, moneda, bancoId, userId: req.user.id });
    res.status(201).json(cuenta);
  } catch (err) { next(err); }
};

export const obtenerCuentas = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Cuentas propias
    const propias = await Cuenta.findAll({
      where: { userId, activa: true },
      include: [{ model: Banco, as: "banco", attributes: ["id", "nombre", "color", "icono"] }],
      order: [["createdAt", "ASC"]],
    });

    // Cuentas compartidas con el usuario (acceso aceptado)
    const accesos = await CuentaAcceso.findAll({
      where: { userId, estado: "aceptado" },
      include: [{
        model: Cuenta,
        as: "cuenta",
        where: { activa: true },
        include: [
          { model: Banco,    as: "banco",       attributes: ["id", "nombre", "color", "icono"] },
          { model: Usuario,  as: "propietario", attributes: ["id", "nombre"] },
        ],
      }],
    });

    const compartidas = accesos.map((a) => ({
      ...a.cuenta.toJSON(),
      rol:         a.rol,
      compartida:  true,
    }));

    res.json({ propias, compartidas });
  } catch (err) { next(err); }
};

export const obtenerCuenta = async (req, res, next) => {
  try {
    const { cuenta, rol } = await verificarAccesoCuenta(req.user.id, req.params.id);
    await cuenta.reload({
      include: [{ model: Banco, as: "banco", attributes: ["id", "nombre", "color", "icono"] }],
    });
    res.json({ ...cuenta.toJSON(), rol });
  } catch (err) { next(err); }
};

export const actualizarCuenta = async (req, res, next) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const { nombre, tipo, moneda, activa } = req.body;
    await cuenta.update({ nombre, tipo, moneda, activa });
    res.json(cuenta);
  } catch (err) { next(err); }
};

export const eliminarCuenta = async (req, res, next) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    await cuenta.destroy();
    res.json({ mensaje: "Cuenta eliminada" });
  } catch (err) { next(err); }
};

export const exportarTransacciones = async (req, res, next) => {
  try {
    const { cuentaId } = req.params;
    const { format = "csv", from, to, categoria, type } = req.query;

    const { cuenta } = await verificarAccesoCuenta(req.user.id, cuentaId, "lector");

    const where = { cuentaId };
    if (from || to) {
      where.date = {};
      if (from) where.date[Op.gte] = new Date(from);
      if (to)   where.date[Op.lte] = new Date(to + "T23:59:59");
    }
    if (categoria) where.category = categoria;
    if (type)      where.type = type;

    const transacciones = await Transaccion.findAll({
      where,
      order: [["date", "DESC"]],
    });

    const slug      = cuenta.nombre.replace(/\s+/g, "-").toLowerCase();
    const fechaHoy  = new Date().toISOString().split("T")[0];
    const nombreBase = `movimientos-${slug}-${fechaHoy}`;

    if (format === "xlsx") {
      const buffer = generarExcel(transacciones);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${nombreBase}.xlsx"`);
      res.send(buffer);
    } else {
      const csv = generarCSV(transacciones);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${nombreBase}.csv"`);
      res.send(csv);
    }
  } catch (err) { next(err); }
};
