import { Router } from "express";
import {
  register, login, refresh, logout,
  getSessions, revokeSession, revokeAllSessions,
  getMe,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refresh);
router.post("/logout",   logout);

router.get("/me",                  authMiddleware, getMe);
router.get("/sessions",            authMiddleware, getSessions);
router.delete("/sessions/:id",     authMiddleware, revokeSession);
router.delete("/sessions",         authMiddleware, revokeAllSessions);

export default router;
