import { Router } from "express";
import { listarInvitaciones, responderInvitacion } from "../controllers/accesosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/",     listarInvitaciones);
router.put("/:id",  responderInvitacion);

export default router;
