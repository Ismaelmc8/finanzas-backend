import { CuentaAcceso, Cuenta, Usuario } from "../models/Loader.js";
import { NotFoundError, ValidationError, ForbiddenError, ConflictError } from "../errors/index.js";
import { Op } from "sequelize";

// ─── Accesos de una cuenta (solo propietario) ─────────────────────────────────

export const listarAccesos = async (req, res, next) => {
  try {
    const { cuentaId } = req.params;
    const cuenta = await Cuenta.findByPk(cuentaId);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const accesos = await CuentaAcceso.findAll({
      where: { cuentaId },
      include: [{ model: Usuario, as: "invitado", attributes: ["id", "nombre", "email"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(accesos);
  } catch (err) { next(err); }
};

export const invitarUsuario = async (req, res, next) => {
  try {
    const { cuentaId } = req.params;
    const { email, rol } = req.body;

    if (!email || !rol) throw new ValidationError("email y rol son obligatorios");
    if (!["editor", "lector"].includes(rol)) throw new ValidationError("rol debe ser 'editor' o 'lector'");

    const cuenta = await Cuenta.findByPk(cuentaId);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const invitado = await Usuario.findOne({ where: { email } });
    if (!invitado) throw new NotFoundError("El usuario no está registrado");
    if (invitado.id === req.user.id) throw new ValidationError("No puedes invitarte a ti mismo");

    const existe = await CuentaAcceso.findOne({
      where: { cuentaId, userId: invitado.id, estado: { [Op.in]: ["pendiente", "aceptado"] } },
    });
    if (existe) throw new ConflictError("El usuario ya tiene acceso o una invitación pendiente");

    const acceso = await CuentaAcceso.create({
      cuentaId, rol,
      userId:      invitado.id,
      invitadoPor: req.user.id,
    });

    res.status(201).json({ ...acceso.toJSON(), invitado: { id: invitado.id, nombre: invitado.nombre, email: invitado.email } });
  } catch (err) { next(err); }
};

export const cambiarRol = async (req, res, next) => {
  try {
    const { cuentaId, accesoId } = req.params;
    const { rol } = req.body;

    if (!["editor", "lector"].includes(rol)) throw new ValidationError("rol debe ser 'editor' o 'lector'");

    const cuenta = await Cuenta.findByPk(cuentaId);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const acceso = await CuentaAcceso.findOne({ where: { id: accesoId, cuentaId } });
    if (!acceso) throw new NotFoundError("Acceso no encontrado");

    await acceso.update({ rol });
    res.json(acceso);
  } catch (err) { next(err); }
};

export const revocarAcceso = async (req, res, next) => {
  try {
    const { cuentaId, accesoId } = req.params;

    const cuenta = await Cuenta.findByPk(cuentaId);
    if (!cuenta) throw new NotFoundError("Cuenta no encontrada");
    if (cuenta.userId !== req.user.id) throw new ForbiddenError();

    const acceso = await CuentaAcceso.findOne({ where: { id: accesoId, cuentaId } });
    if (!acceso) throw new NotFoundError("Acceso no encontrado");

    await acceso.destroy();
    res.json({ mensaje: "Acceso revocado" });
  } catch (err) { next(err); }
};

// ─── Invitaciones del usuario autenticado ─────────────────────────────────────

export const listarInvitaciones = async (req, res, next) => {
  try {
    const invitaciones = await CuentaAcceso.findAll({
      where: { userId: req.user.id, estado: "pendiente" },
      include: [
        { model: Cuenta,   as: "cuenta",           include: [{ model: Usuario, as: "propietario", attributes: ["id", "nombre"] }] },
        { model: Usuario,  as: "propietarioAcceso", attributes: ["id", "nombre", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(invitaciones);
  } catch (err) { next(err); }
};

export const responderInvitacion = async (req, res, next) => {
  try {
    const { accion } = req.body;
    if (!["aceptar", "rechazar"].includes(accion)) throw new ValidationError("accion debe ser 'aceptar' o 'rechazar'");

    const acceso = await CuentaAcceso.findByPk(req.params.id);
    if (!acceso) throw new NotFoundError("Invitación no encontrada");
    if (acceso.userId !== req.user.id) throw new ForbiddenError();
    if (acceso.estado !== "pendiente") throw new ValidationError("La invitación ya fue respondida");

    await acceso.update({ estado: accion === "aceptar" ? "aceptado" : "rechazado" });
    res.json({ mensaje: accion === "aceptar" ? "Invitación aceptada" : "Invitación rechazada", acceso });
  } catch (err) { next(err); }
};
