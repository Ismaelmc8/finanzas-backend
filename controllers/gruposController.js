import { Grupo } from "../models/Loader.js";
// Crear grupo
export const crearGrupo = async (req, res) => {
  try {
    const nuevo = await Grupo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos los grupos
export const obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un grupo por ID
export const obtenerGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo no encontrado" });
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar grupo
export const actualizarGrupo = async (req, res) => {
  try {
    const [updated] = await Grupo.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Grupo no encontrado" });
    const grupoActualizado = await Grupo.findByPk(req.params.id);
    res.json(grupoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar grupo
export const eliminarGrupo = async (req, res) => {
  try {
    const deleted = await Grupo.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Grupo no encontrado" });
    res.json({ mensaje: "Grupo eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
