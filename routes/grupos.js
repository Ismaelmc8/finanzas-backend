// routes/gruposRoutes.js
import express from "express";
import {
  crearGrupo,
  obtenerGrupos,
  obtenerGrupo,
  actualizarGrupo,
  eliminarGrupo,
} from "../controllers/gruposController.js";

const router = express.Router();

router.post("/", crearGrupo);
router.get("/", obtenerGrupos);
router.get("/:id", obtenerGrupo);
router.put("/:id", actualizarGrupo);
router.delete("/:id", eliminarGrupo);

export default router;
