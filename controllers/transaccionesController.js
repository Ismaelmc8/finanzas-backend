// controllers/transaccionesController.js

import { TransaccionModel } from '../models/Transaccion.js';
import sequelize from "../config/db.js";
import fs from 'fs';
import { procesarExcelTransacciones } from '../services/excelImportService.js';

export const Transaccion = TransaccionModel(sequelize);

// Crear transacción
export const crearTransaccion = async (req, res) => {
  try {
    const { units, price } = req.body;
    const total = units * price;
    const nueva = await Transaccion.create({ ...req.body, total });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Listar transacciones
export const obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener transacción por ID
export const obtenerTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) return res.status(404).json({ error: "No encontrada" });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
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
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar transacción
export const eliminarTransaccion = async (req, res) => {
  try {
    const deleted = await Transaccion.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "No encontrada" });
    res.json({ mensaje: "Transacción eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const importarTransacciones = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }

    const transacciones = procesarExcelTransacciones(req.file.path);

    if (!transacciones.length) {
      return res.status(400).json({ error: 'El archivo está vacío' });
    }

    await Transaccion.bulkCreate(transacciones);

    fs.unlinkSync(req.file.path); // eliminar archivo temporal

    res.json({
      mensaje: 'Importación completada',
      totalImportadas: transacciones.length
    });

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};