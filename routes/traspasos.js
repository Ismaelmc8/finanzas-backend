import { Router } from "express";
import { crearTraspaso, eliminarTraspaso } from "../controllers/traspasosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/",      authMiddleware, crearTraspaso);
router.delete("/:id", authMiddleware, eliminarTraspaso);

export default router;
