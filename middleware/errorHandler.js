import { AppError, ValidationError, ConflictError } from '../errors/index.js';

export const errorHandler = (err, req, res, next) => {
  // Error operacional conocido — lanzado intencionalmente con AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Error de Multer: archivo demasiado grande
  if (err.code === 'LIMIT_FILE_SIZE') {
    const limitMB = (process.env.MAX_FILE_SIZE_MB || 5);
    return res.status(400).json({ error: `El archivo supera el límite de ${limitMB} MB` });
  }

  // Error de Sequelize: valor duplicado (unique constraint)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  }

  // Error de Sequelize: validación de modelo
  if (err.name === 'SequelizeValidationError') {
    const mensaje = err.errors.map(e => e.message).join(', ');
    return res.status(400).json({ error: mensaje });
  }

  // Error inesperado — loguear completo en servidor, respuesta genérica al cliente
  console.error(`[error] ${req.method} ${req.path}:`, err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
