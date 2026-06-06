import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  obtenerPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
} from "../controllers/presupuestosController.js";

const router = Router();

router.use(authMiddleware);

router.get("/",       obtenerPresupuestos);
router.post("/",      crearPresupuesto);
router.put("/:id",    actualizarPresupuesto);
router.delete("/:id", eliminarPresupuesto);

export default router;
