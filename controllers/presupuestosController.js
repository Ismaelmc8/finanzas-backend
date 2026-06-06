import { Op } from "sequelize";
import { Presupuesto, Categoria, Cuenta, Transaccion } from "../models/Loader.js";
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from "../errors/index.js";

const inicioYFinDeMes = (año, mes) => {
  const inicio = new Date(año, mes - 1, 1);
  const fin    = new Date(año, mes, 0, 23, 59, 59, 999);
  return { inicio, fin };
};

export const obtenerPresupuestos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ahora  = new Date();
    const año    = parseInt(req.query.año  || ahora.getFullYear());
    const mes    = parseInt(req.query.mes  || ahora.getMonth() + 1);
    const { inicio, fin } = inicioYFinDeMes(año, mes);

    const presupuestos = await Presupuesto.findAll({
      where: { userId },
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre", "color", "icono"] },
        { model: Cuenta,    as: "cuenta",    attributes: ["id", "nombre"], required: false },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Calcular gasto real del mes para cada presupuesto
    const resultado = await Promise.all(
      presupuestos.map(async (p) => {
        const whereGasto = {
          userId,
          type:  "gasto",
          date:  { [Op.between]: [inicio, fin] },
          category: p.categoria.nombre,
        };
        if (p.cuentaId) whereGasto.cuentaId = p.cuentaId;

        const gastado = (await Transaccion.sum("total", { where: whereGasto })) || 0;
        const porcentaje = p.importe > 0 ? Math.round((gastado / p.importe) * 100) : 0;

        return {
          ...p.toJSON(),
          gastado,
          porcentaje,
          estado: porcentaje >= 100 ? "superado" : porcentaje >= 80 ? "aviso" : "ok",
        };
      })
    );

    res.json(resultado);
  } catch (err) { next(err); }
};

export const crearPresupuesto = async (req, res, next) => {
  try {
    const { categoriaId, importe, cuentaId } = req.body;
    const userId = req.user.id;

    if (!categoriaId || !importe) throw new ValidationError("categoriaId e importe son obligatorios");
    if (importe <= 0)             throw new ValidationError("El importe debe ser mayor que 0");

    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria || categoria.userId !== userId) throw new NotFoundError("Categoría no encontrada");

    if (cuentaId) {
      const cuenta = await Cuenta.findByPk(cuentaId);
      if (!cuenta || cuenta.userId !== userId) throw new NotFoundError("Cuenta no encontrada");
    }

    const existente = await Presupuesto.findOne({
      where: {
        userId,
        categoriaId,
        cuentaId: cuentaId || null,
      },
    });
    if (existente) throw new ConflictError("Ya existe un presupuesto para esta categoría y cuenta");

    const presupuesto = await Presupuesto.create({ userId, categoriaId, importe, cuentaId: cuentaId || null });
    res.status(201).json(presupuesto);
  } catch (err) { next(err); }
};

export const actualizarPresupuesto = async (req, res, next) => {
  try {
    const p = await Presupuesto.findByPk(req.params.id);
    if (!p) throw new NotFoundError("Presupuesto no encontrado");
    if (p.userId !== req.user.id) throw new ForbiddenError();

    const { importe } = req.body;
    if (importe !== undefined && importe <= 0) throw new ValidationError("El importe debe ser mayor que 0");

    await p.update({ importe });
    res.json(p);
  } catch (err) { next(err); }
};

export const eliminarPresupuesto = async (req, res, next) => {
  try {
    const p = await Presupuesto.findByPk(req.params.id);
    if (!p) throw new NotFoundError("Presupuesto no encontrado");
    if (p.userId !== req.user.id) throw new ForbiddenError();

    await p.destroy();
    res.json({ mensaje: "Presupuesto eliminado" });
  } catch (err) { next(err); }
};
