// controllers/transaccionesController.js
import { TransaccionModel } from '../models/Transaccion.js';
import sequelize from "../config/db.js";

export const Transaccion = TransaccionModel(sequelize);

// Crear transacción
export const crearTransaccion = async (req, res) => {
  try {
    const { units, price } = req.body;
    const total = units * price;
    const nueva = await Transaccion.create({ ...req.body, total });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar transacciones
export const obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener transacción por ID
export const obtenerTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) return res.status(404).json({ error: "No encontrada" });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar transacción
export const actualizarTransaccion = async (req, res) => {
  try {
    const { units, price } = req.body;
    const total = units * price;
    const [updated] = await Transaccion.update({ ...req.body, total }, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: "No encontrada" });
    const transaccionActualizada = await Transaccion.findByPk(req.params.id);
    res.json(transaccionActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar transacción
export const eliminarTransaccion = async (req, res) => {
  try {
    const deleted = await Transaccion.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "No encontrada" });
    res.json({ mensaje: "Transacción eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
