import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { crearCuenta, obtenerCuentas, obtenerCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentasController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", obtenerCuentas);
router.post("/", crearCuenta);
router.get("/:id", obtenerCuenta);
router.put("/:id", actualizarCuenta);
router.delete("/:id", eliminarCuenta);

export default router;
