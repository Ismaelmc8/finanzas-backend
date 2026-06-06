import { TransaccionModel } from '../models/Transaccion.js';
import sequelize from "../config/db.js";
import fs from 'fs';
import { procesarExcelTransacciones } from '../services/excelImportService.js';
import { NotFoundError, ValidationError } from '../errors/index.js';

export const Transaccion = TransaccionModel(sequelize);

export const crearTransaccion = async (req, res, next) => {
  try {
    const { units, price } = req.body;
    const total = units * price;
    const nueva = await Transaccion.create({ ...req.body, total });
    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
};

export const obtenerTransacciones = async (req, res, next) => {
  try {
    const transacciones = await Transaccion.findAll();
    res.json(transacciones);
  } catch (error) {
    next(error);
  }
};

export const obtenerTransaccion = async (req, res, next) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) throw new NotFoundError('Transacción no encontrada');
    res.json(transaccion);
  } catch (error) {
    next(error);
  }
};

export const actualizarTransaccion = async (req, res, next) => {
  try {
    const { units, price } = req.body;
    const total = units * price;
    const [updated] = await Transaccion.update({ ...req.body, total }, {
      where: { id: req.params.id }
    });
    if (!updated) throw new NotFoundError('Transacción no encontrada');
    const transaccionActualizada = await Transaccion.findByPk(req.params.id);
    res.json(transaccionActualizada);
  } catch (error) {
    next(error);
  }
};

export const eliminarTransaccion = async (req, res, next) => {
  try {
    const deleted = await Transaccion.destroy({ where: { id: req.params.id } });
    if (!deleted) throw new NotFoundError('Transacción no encontrada');
    res.json({ mensaje: 'Transacción eliminada' });
  } catch (error) {
    next(error);
  }
};

export const importarTransacciones = async (req, res, next) => {
  try {
    if (!req.file) throw new ValidationError('Archivo requerido');

    const transacciones = procesarExcelTransacciones(req.file.path);

    if (!transacciones.length) throw new ValidationError('El archivo está vacío');

    await Transaccion.bulkCreate(transacciones);
    fs.unlinkSync(req.file.path);

    res.json({ mensaje: 'Importación completada', totalImportadas: transacciones.length });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
};
