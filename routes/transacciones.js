// routes/transacciones.js
import upload from '../middleware/uploadMiddleware.js';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  crearTransaccion,
  obtenerTransacciones,
  obtenerTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  importarTransacciones
} from '../controllers/transaccionesController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', crearTransaccion);
router.get('/', obtenerTransacciones);
router.get('/:id', obtenerTransaccion);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);
router.post('/import', upload.single('file'), importarTransacciones);

export default router;
