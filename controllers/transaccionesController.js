import { Op } from 'sequelize';
import { Transaccion, Cuenta } from '../models/Loader.js';
import { recalcularBalance, verificarAccesoCuenta } from './cuentasController.js';
import fs from 'fs';
import { procesarExcelTransacciones } from '../services/excelImportService.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../errors/index.js';

function calcularProximaFecha(date, frecuenciaValor, frecuenciaUnidad) {
  const d = new Date(date);
  const v = frecuenciaValor || 1;
  switch (frecuenciaUnidad) {
    case 'dia': d.setDate(d.getDate() + v);           break;
    case 'mes': d.setMonth(d.getMonth() + v);         break;
    case 'año': d.setFullYear(d.getFullYear() + v);   break;
  }
  return d;
}

export const crearTransaccion = async (req, res, next) => {
  try {
    const { units, price, cuentaId, recurrente, frecuenciaValor, frecuenciaUnidad, date } = req.body;

    if (recurrente && (!frecuenciaValor || !frecuenciaUnidad)) {
      throw new ValidationError('frecuenciaValor y frecuenciaUnidad son obligatorios para transacciones recurrentes');
    }

    if (cuentaId) {
      await verificarAccesoCuenta(req.user.id, cuentaId, 'editor');
    }

    const total = units * price;
    const proximaFecha = recurrente ? calcularProximaFecha(date, frecuenciaValor, frecuenciaUnidad) : null;

    const nueva = await Transaccion.create({
      ...req.body,
      total,
      proximaFecha,
      userId: req.user.id,
    });

    if (cuentaId) await recalcularBalance(cuentaId);

    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
};

export const obtenerTransacciones = async (req, res, next) => {
  try {
    const { cuentaId } = req.query;
    let where;

    if (cuentaId) {
      await verificarAccesoCuenta(req.user.id, cuentaId, 'lector');
      where = { cuentaId };
    } else {
      where = { userId: req.user.id };
    }

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

    if (transaccion.cuentaId) {
      await verificarAccesoCuenta(req.user.id, transaccion.cuentaId, 'lector');
    } else if (transaccion.userId !== req.user.id) {
      throw new ForbiddenError();
    }

    res.json(transaccion);
  } catch (error) {
    next(error);
  }
};

export const actualizarTransaccion = async (req, res, next) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (!transaccion) throw new NotFoundError('Transacción no encontrada');

    if (transaccion.cuentaId) {
      await verificarAccesoCuenta(req.user.id, transaccion.cuentaId, 'editor');
    } else if (transaccion.userId !== req.user.id) {
      throw new ForbiddenError();
    }

    const { units, price, recurrente, frecuenciaValor, frecuenciaUnidad, date } = req.body;

    if (recurrente && (!frecuenciaValor || !frecuenciaUnidad)) {
      throw new ValidationError('frecuenciaValor y frecuenciaUnidad son obligatorios para transacciones recurrentes');
    }

    const total = units * price;
    const proximaFecha = recurrente
      ? calcularProximaFecha(date || transaccion.date, frecuenciaValor, frecuenciaUnidad)
      : null;
    const cuentaIdAnterior = transaccion.cuentaId;

    await transaccion.update({ ...req.body, total, proximaFecha });

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

    if (transaccion.cuentaId) {
      await verificarAccesoCuenta(req.user.id, transaccion.cuentaId, 'editor');
    } else if (transaccion.userId !== req.user.id) {
      throw new ForbiddenError();
    }

    const cuentaId = transaccion.cuentaId;
    const { modo } = req.query;

    // Si es recurrente o copia generada y se pide cancelar la recurrencia
    if (modo === 'cancelar') {
      const plantillaId = transaccion.recurrente ? transaccion.id : transaccion.recurrenciaId;
      if (plantillaId) {
        await Transaccion.update({ recurrente: false, proximaFecha: null }, { where: { id: plantillaId } });
      }
    }

    await transaccion.destroy();
    if (cuentaId) await recalcularBalance(cuentaId);

    res.json({ mensaje: 'Transacción eliminada' });
  } catch (error) {
    next(error);
  }
};

export const generarRecurrentes = async (req, res, next) => {
  try {
    const ahora = new Date();
    ahora.setHours(23, 59, 59, 999);

    const plantillas = await Transaccion.findAll({
      where: {
        userId: req.user.id,
        recurrente: true,
        proximaFecha: { [Op.lte]: ahora },
      },
    });

    let generadas = 0;
    for (const p of plantillas) {
      const { id, recurrenciaId, recurrente, proximaFecha, frecuenciaValor, frecuenciaUnidad, createdAt, updatedAt, ...datos } = p.toJSON();

      await Transaccion.create({
        ...datos,
        date: proximaFecha,
        recurrente: false,
        recurrenciaId: id,
        proximaFecha: null,
        frecuenciaValor: null,
        frecuenciaUnidad: null,
      });

      await p.update({ proximaFecha: calcularProximaFecha(proximaFecha, frecuenciaValor, frecuenciaUnidad) });

      if (datos.cuentaId) await recalcularBalance(datos.cuentaId);
      generadas++;
    }

    res.json({ generadas });
  } catch (error) {
    next(error);
  }
};

export const importarTransacciones = async (req, res, next) => {
  try {
    if (!req.file) throw new ValidationError('Archivo requerido');

    const { cuentaId } = req.body;

    if (cuentaId) {
      await verificarAccesoCuenta(req.user.id, cuentaId, 'editor');
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
