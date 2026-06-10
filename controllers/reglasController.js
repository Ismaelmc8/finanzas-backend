import { ReglaCategorizacion, Categoria } from "../models/Loader.js";
import { NotFoundError, ValidationError, ForbiddenError } from "../errors/index.js";

export const getReglas = async (req, res, next) => {
  try {
    const reglas = await ReglaCategorizacion.findAll({
      where: { userId: req.user.id },
      include: [{ model: Categoria, as: "categoria", attributes: ["id", "nombre", "icono", "color"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(reglas);
  } catch (err) { next(err); }
};

export const createRegla = async (req, res, next) => {
  try {
    const { patron, categoriaId } = req.body;
    if (!patron?.trim()) throw new ValidationError("El patrón es obligatorio");
    if (!categoriaId)     throw new ValidationError("La categoría es obligatoria");

    const cat = await Categoria.findOne({ where: { id: categoriaId, userId: req.user.id } });
    if (!cat) throw new ForbiddenError("Categoría no válida");

    const regla = await ReglaCategorizacion.create({
      userId: req.user.id,
      patron: patron.trim().toUpperCase(),
      categoriaId,
    });

    const conCategoria = await ReglaCategorizacion.findByPk(regla.id, {
      include: [{ model: Categoria, as: "categoria", attributes: ["id", "nombre", "icono", "color"] }],
    });
    res.status(201).json(conCategoria);
  } catch (err) { next(err); }
};

export const updateRegla = async (req, res, next) => {
  try {
    const regla = await ReglaCategorizacion.findByPk(req.params.id);
    if (!regla) throw new NotFoundError("Regla no encontrada");
    if (regla.userId !== req.user.id) throw new ForbiddenError();

    const { patron, categoriaId } = req.body;
    const updates = {};
    if (patron)      updates.patron      = patron.trim().toUpperCase();
    if (categoriaId) updates.categoriaId = categoriaId;

    await regla.update(updates);
    const actualizada = await ReglaCategorizacion.findByPk(regla.id, {
      include: [{ model: Categoria, as: "categoria", attributes: ["id", "nombre", "icono", "color"] }],
    });
    res.json(actualizada);
  } catch (err) { next(err); }
};

export const deleteRegla = async (req, res, next) => {
  try {
    const regla = await ReglaCategorizacion.findByPk(req.params.id);
    if (!regla) throw new NotFoundError("Regla no encontrada");
    if (regla.userId !== req.user.id) throw new ForbiddenError();

    await regla.destroy();
    res.json({ mensaje: "Regla eliminada" });
  } catch (err) { next(err); }
};
