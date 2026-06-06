import { Grupo } from "../models/Loader.js";

export const crearGrupo = async (req, res) => {
  try {
    const nuevo = await Grupo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('[grupos] crearGrupo:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    console.error('[grupos] obtenerGrupos:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo no encontrado" });
    res.json(grupo);
  } catch (error) {
    console.error('[grupos] obtenerGrupo:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarGrupo = async (req, res) => {
  try {
    const [updated] = await Grupo.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Grupo no encontrado" });
    const grupoActualizado = await Grupo.findByPk(req.params.id);
    res.json(grupoActualizado);
  } catch (error) {
    console.error('[grupos] actualizarGrupo:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarGrupo = async (req, res) => {
  try {
    const deleted = await Grupo.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Grupo no encontrado" });
    res.json({ mensaje: "Grupo eliminado" });
  } catch (error) {
    console.error('[grupos] eliminarGrupo:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
