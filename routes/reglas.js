import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getReglas, createRegla, updateRegla, deleteRegla } from "../controllers/reglasController.js";

const router = Router();
router.use(authMiddleware);

router.get("/",        getReglas);
router.post("/",       createRegla);
router.put("/:id",     updateRegla);
router.delete("/:id",  deleteRegla);

export default router;
