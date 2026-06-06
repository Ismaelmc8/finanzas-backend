import { Categoria, Transaccion } from "../models/Loader.js";
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from "../errors/index.js";

export const obtenerCategorias = async (req, res, next) => {
  try {
    const raices = await Categoria.findAll({
      where: { userId: req.user.id, parentId: null, activa: true },
      include: [{ model: Categoria, as: "subcategorias", where: { activa: true }, required: false }],
      order: [["nombre", "ASC"], [{ model: Categoria, as: "subcategorias" }, "nombre", "ASC"]],
    });
    res.json(raices);
  } catch (err) { next(err); }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, tipo, color, icono, parentId } = req.body;
    if (!nombre) throw new ValidationError("El nombre es obligatorio");

    if (parentId) {
      const padre = await Categoria.findByPk(parentId);
      if (!padre || padre.userId !== req.user.id) throw new NotFoundError("Categoría padre no encontrada");
      if (padre.parentId !== null) throw new ValidationError("No se permiten más de dos niveles de categorías");
    }

    const categoria = await Categoria.create({
      nombre, tipo, color, icono, parentId: parentId || null, userId: req.user.id,
    });
    res.status(201).json(categoria);
  } catch (err) { next(err); }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) throw new NotFoundError("Categoría no encontrada");
    if (categoria.userId !== req.user.id) throw new ForbiddenError();

    const { nombre, tipo, color, icono } = req.body;
    await categoria.update({ nombre, tipo, color, icono });
    res.json(categoria);
  } catch (err) { next(err); }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) throw new NotFoundError("Categoría no encontrada");
    if (categoria.userId !== req.user.id) throw new ForbiddenError();

    const enUso = await Transaccion.count({ where: { category: categoria.nombre, userId: req.user.id } });
    if (enUso > 0) throw new ConflictError(`No se puede eliminar: hay ${enUso} transacción(es) con esta categoría`);

    // Desasociar subcategorías (las convierte en raíz)
    await Categoria.update({ parentId: null }, { where: { parentId: categoria.id, userId: req.user.id } });

    await categoria.destroy();
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) { next(err); }
};
