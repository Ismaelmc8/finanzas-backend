import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { crearBanco, obtenerBancos, actualizarBanco, eliminarBanco } from "../controllers/bancosController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", obtenerBancos);
router.post("/", crearBanco);
router.put("/:id", actualizarBanco);
router.delete("/:id", eliminarBanco);

export default router;
