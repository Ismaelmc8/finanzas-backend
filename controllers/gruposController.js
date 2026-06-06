import { Grupo } from "../models/Loader.js";
import { NotFoundError } from "../errors/index.js";

export const crearGrupo = async (req, res, next) => {
  try {
    const nuevo = await Grupo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

export const obtenerGrupos = async (req, res, next) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    next(error);
  }
};

export const obtenerGrupo = async (req, res, next) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) throw new NotFoundError('Grupo no encontrado');
    res.json(grupo);
  } catch (error) {
    next(error);
  }
};

export const actualizarGrupo = async (req, res, next) => {
  try {
    const [updated] = await Grupo.update(req.body, { where: { id: req.params.id } });
    if (!updated) throw new NotFoundError('Grupo no encontrado');
    const grupoActualizado = await Grupo.findByPk(req.params.id);
    res.json(grupoActualizado);
  } catch (error) {
    next(error);
  }
};

export const eliminarGrupo = async (req, res, next) => {
  try {
    const deleted = await Grupo.destroy({ where: { id: req.params.id } });
    if (!deleted) throw new NotFoundError('Grupo no encontrado');
    res.json({ mensaje: 'Grupo eliminado' });
  } catch (error) {
    next(error);
  }
};
