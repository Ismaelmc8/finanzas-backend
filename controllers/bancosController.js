import { Banco, Cuenta } from "../models/Loader.js";
import { NotFoundError, ForbiddenError } from "../errors/index.js";

export const crearBanco = async (req, res, next) => {
  try {
    const { nombre, color, icono } = req.body;
    const banco = await Banco.create({ nombre, color, icono, userId: req.user.id });
    res.status(201).json(banco);
  } catch (error) {
    next(error);
  }
};

export const obtenerBancos = async (req, res, next) => {
  try {
    const bancos = await Banco.findAll({
      where: { userId: req.user.id },
      include: [{ model: Cuenta, as: "cuentas", where: { activa: true }, required: false }],
      order: [["createdAt", "ASC"], [{ model: Cuenta, as: "cuentas" }, "createdAt", "ASC"]],
    });
    res.json(bancos);
  } catch (error) {
    next(error);
  }
};

export const actualizarBanco = async (req, res, next) => {
  try {
    const banco = await Banco.findByPk(req.params.id);
    if (!banco) throw new NotFoundError("Banco no encontrado");
    if (banco.userId !== req.user.id) throw new ForbiddenError();

    const { nombre, color, icono } = req.body;
    await banco.update({ nombre, color, icono });
    res.json(banco);
  } catch (error) {
    next(error);
  }
};

export const eliminarBanco = async (req, res, next) => {
  try {
    const banco = await Banco.findByPk(req.params.id);
    if (!banco) throw new NotFoundError("Banco no encontrado");
    if (banco.userId !== req.user.id) throw new ForbiddenError();

    await banco.destroy();
    res.json({ mensaje: "Banco eliminado" });
  } catch (error) {
    next(error);
  }
};
