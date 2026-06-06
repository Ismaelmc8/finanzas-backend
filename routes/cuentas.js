import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { crearCuenta, obtenerCuentas, obtenerCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentasController.js";
import { listarAccesos, invitarUsuario, cambiarRol, revocarAcceso } from "../controllers/accesosController.js";

const router = express.Router();
router.use(authMiddleware);

// CRUD cuentas
router.get("/",    obtenerCuentas);
router.post("/",   crearCuenta);
router.get("/:id", obtenerCuenta);
router.put("/:id", actualizarCuenta);
router.delete("/:id", eliminarCuenta);

// Accesos compartidos (subrutas de una cuenta)
router.get("/:cuentaId/accesos",              listarAccesos);
router.post("/:cuentaId/accesos",             invitarUsuario);
router.put("/:cuentaId/accesos/:accesoId",    cambiarRol);
router.delete("/:cuentaId/accesos/:accesoId", revocarAcceso);

export default router;
