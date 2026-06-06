import { Cuenta, Banco, Transaccion } from "../models/Loader.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../errors/index.js";
import { Op } from "sequelize";

export const recalcularBalance = async (cuentaId) => {
  const ingresos  = await Transaccion.sum("total", { where: { cuentaId, type: "ingreso"  } }) || 0;
  const gastos    = await Transaccion.sum("total", { where: { cuentaId, type: "gasto"    } }) || 0;
  const traspasos = await Transaccion.sum("total", { where: { cuentaId, type: "traspaso" } }) || 0;
  await Cuenta.update({ balance: ingresos - gastos + traspasos }, { where: { id: cuentaId } });
};

export const crearCuenta = async (req, res, next) => {
  try {
    const { nombre, tipo, moneda, bancoId } = req.body;

    const banco = await Banco.findByPk(bancoId);
    if (!banco) throw new NotFoundError("Banco no encontrado");
    if (banco.userId !== req.user.id) throw new ForbiddenError();

    const cuenta = await Cuenta.create({ nombre, tipo, moneda, bancoId, userId: req.user.id });
    res.status(201).json(cuenta);
  } catch (error) {
    next(error);
  }
};

export const obtenerCuentas = async (req, res, next) => {
  try {
    const cuentas = await Cuenta.findAll({
      where: { userId: req.user.id, activa: true },
      include: [{ model: Banco, as: "banco", attributes: ["id", "nombre", "color", "icono"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(cuentas);
  } catch (error) {
    next(error);
  }
};

export const obtenerCuenta = async (req, res, next) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id, {
      include: [{ model: Banco, as: "banco", attributes: ["id", "nombre", "color", "icono"] }],
    });
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    res.json(cuenta);
  } catch (error) {
    next(error);
  }
};

export const actualizarCuenta = async (req, res, next) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const { nombre, tipo, moneda, activa } = req.body;
    await cuenta.update({ nombre, tipo, moneda, activa });
    res.json(cuenta);
  } catch (error) {
    next(error);
  }
};

export const eliminarCuenta = async (req, res, next) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    await cuenta.destroy();
    res.json({ mensaje: "Cuenta eliminada" });
  } catch (error) {
    next(error);
  }
};
