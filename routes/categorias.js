import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriasController.js";

const router = Router();

router.use(authMiddleware);

router.get("/",    obtenerCategorias);
router.post("/",   crearCategoria);
router.put("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

export default router;
