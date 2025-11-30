// routes/transacciones.js
import express from 'express';
import { 
  crearTransaccion, 
  obtenerTransacciones, 
  obtenerTransaccion, 
  actualizarTransaccion, 
  eliminarTransaccion 
} from '../controllers/transaccionesController.js';

const router = express.Router();

router.post('/', crearTransaccion);           // Crear
router.get('/', obtenerTransacciones);        // Listar todas
router.get('/:id', obtenerTransaccion);       // Obtener por ID
router.put('/:id', actualizarTransaccion);    // Actualizar
router.delete('/:id', eliminarTransaccion);  // Eliminar

router.get('/prueba', (req, res) => {
    res.json({ mensaje: 'La API funciona correctamente!' });
});

export default router;
