import { Transaccion, Cuenta } from '../models/Loader.js';
import { recalcularBalance } from './cuentasController.js';
import fs from 'fs';
import { procesarExcelTransacciones } from '../services/excelImportService.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../errors/index.js';

export const crearTransaccion = async (req, res, next) => {
  try {
    const { units, price, cuentaId } = req.body;

    if (cuentaId) {
      const cuenta = await Cuenta.findByPk(cuentaId);
      if (!cuenta) throw new NotFoundError('Cuenta no encontrada');
      if (cuenta.userId !== req.user.id) throw new ForbiddenError();
    }

    const total = units * price;
    const nueva = await Transaccion.create({ ...req.body, total, userId: req.user.id });

    if (cuentaId) await recalcularBalance(cuentaId);

    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
};

export const obtenerTransacciones = async (req, res, next) => {
  try {
    const where = { userId: req.user.id };
    if (req.query.cuentaId) where.cuentaId = req.query.cuentaId;

    const transacciones = await Transaccion.findAll({
      where,
      order: [['date', 'DESC']],
    });
    res.json(transacciones);
  } catch (error) {
    next(error);
  }
};

export const obtenerTransaccion = async (req, res, next) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) throw new NotFoundError('Transacción no encontrada');
    if (transaccion.userId !== req.user.id) throw new ForbiddenError();
    res.json(transaccion);
  } catch (error) {
    next(error);
  }
};

export const actualizarTransaccion = async (req, res, next) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) throw new NotFoundError('Transacción no encontrada');
    if (transaccion.userId !== req.user.id) throw new ForbiddenError();

    const { units, price } = req.body;
    const total = units * price;
    const cuentaIdAnterior = transaccion.cuentaId;

    await transaccion.update({ ...req.body, total });

    const cuentaIdNuevo = transaccion.cuentaId;
    if (cuentaIdAnterior) await recalcularBalance(cuentaIdAnterior);
    if (cuentaIdNuevo && cuentaIdNuevo !== cuentaIdAnterior) await recalcularBalance(cuentaIdNuevo);

    res.json(transaccion);
  } catch (error) {
    next(error);
  }
};

export const eliminarTransaccion = async (req, res, next) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) throw new NotFoundError('Transacción no encontrada');
    if (transaccion.userId !== req.user.id) throw new ForbiddenError();

    const cuentaId = transaccion.cuentaId;
    await transaccion.destroy();
    if (cuentaId) await recalcularBalance(cuentaId);

    res.json({ mensaje: 'Transacción eliminada' });
  } catch (error) {
    next(error);
  }
};

export const importarTransacciones = async (req, res, next) => {
  try {
    if (!req.file) throw new ValidationError('Archivo requerido');

    const { cuentaId } = req.body;

    if (cuentaId) {
      const cuenta = await Cuenta.findByPk(cuentaId);
      if (!cuenta) throw new NotFoundError('Cuenta no encontrada');
      if (cuenta.userId !== req.user.id) throw new ForbiddenError();
    }

    const transacciones = procesarExcelTransacciones(req.file.path);
    if (!transacciones.length) throw new ValidationError('El archivo está vacío');

    const data = transacciones.map(t => ({ ...t, userId: req.user.id, cuentaId: cuentaId || null }));
    await Transaccion.bulkCreate(data);
    fs.unlinkSync(req.file.path);

    if (cuentaId) await recalcularBalance(cuentaId);

    res.json({ mensaje: 'Importación completada', totalImportadas: transacciones.length });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
};
