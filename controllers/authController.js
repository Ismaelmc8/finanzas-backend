import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import Usuario from "../models/Usuario.js";
import { RefreshToken, Categoria } from "../models/Loader.js";
import { CATEGORIAS_DEFAULT } from "../data/categorias-default.js";
import { ValidationError, UnauthorizedError, NotFoundError } from "../errors/index.js";

export const seedCategorias = async (userId) => {
  for (const def of CATEGORIAS_DEFAULT) {
    const { subcategorias = [], ...datos } = def;
    const raiz = await Categoria.create({ ...datos, userId });
    if (subcategorias.length) {
      await Categoria.bulkCreate(
        subcategorias.map((s) => ({ ...s, parentId: raiz.id, userId }))
      );
    }
  }
};

const ACCESS_TOKEN_TTL  = "15m";
const REFRESH_TOKEN_DAYS = 30;
const COOKIE_NAME = "refreshToken";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  path: "/",
};

const emitirTokens = async (usuario, req, res) => {
  // Access token JWT (15 min)
  const accessToken = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

  // Refresh token aleatorio
  const rawRefresh = crypto.randomBytes(64).toString("hex");
  const tokenHash  = hashToken(rawRefresh);
  const expiresAt  = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    tokenHash,
    userId:    usuario.id,
    expiresAt,
    userAgent: req.headers["user-agent"] || null,
    ip:        req.ip || null,
    lastUsedAt: new Date(),
  });

  res.cookie(COOKIE_NAME, rawRefresh, cookieOptions);
  return accessToken;
};

// ─── Registro ───────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) throw new ValidationError("nombre, email y password son obligatorios");

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) throw new ValidationError("El email ya está registrado");

    const password_hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password_hash });

    await seedCategorias(usuario.id);

    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) { next(err); }
};

// ─── Login ──────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError("email y password son obligatorios");

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) throw new ValidationError("Credenciales incorrectas");

    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) throw new ValidationError("Credenciales incorrectas");

    const token = await emitirTokens(usuario, req, res);

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) { next(err); }
};

// ─── Refresh ─────────────────────────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const raw = req.cookies?.[COOKIE_NAME];
    if (!raw) throw new UnauthorizedError("Sin refresh token");

    const tokenHash = hashToken(raw);
    const stored = await RefreshToken.findOne({ where: { tokenHash } });

    if (!stored)                throw new UnauthorizedError("Refresh token inválido");
    if (stored.revokedAt)       throw new UnauthorizedError("Sesión cerrada");
    if (stored.expiresAt < new Date()) throw new UnauthorizedError("Sesión expirada");

    // Revocar token actual (rotación)
    await stored.update({ revokedAt: new Date() });

    const usuario = await Usuario.findByPk(stored.userId);
    if (!usuario) throw new UnauthorizedError("Usuario no encontrado");

    const token = await emitirTokens(usuario, req, res);

    res.json({ token });
  } catch (err) { next(err); }
};

// ─── Logout ──────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    const raw = req.cookies?.[COOKIE_NAME];
    if (raw) {
      const tokenHash = hashToken(raw);
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash, revokedAt: null } }
      );
    }
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ mensaje: "Sesión cerrada" });
  } catch (err) { next(err); }
};

// ─── Sesiones activas ─────────────────────────────────────────
export const getSessions = async (req, res, next) => {
  try {
    const raw = req.cookies?.[COOKIE_NAME];
    const currentHash = raw ? hashToken(raw) : null;

    const sessions = await RefreshToken.findAll({
      where: {
        userId:    req.user.id,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
      attributes: ["id", "tokenHash", "userAgent", "ip", "lastUsedAt", "createdAt"],
      order: [["lastUsedAt", "DESC"]],
    });

    res.json(
      sessions.map((s) => ({
        id:         s.id,
        userAgent:  s.userAgent,
        ip:         s.ip,
        lastUsedAt: s.lastUsedAt,
        createdAt:  s.createdAt,
        current:    s.tokenHash === currentHash,
      }))
    );
  } catch (err) { next(err); }
};

// ─── Revocar sesión concreta ──────────────────────────────────
export const revokeSession = async (req, res, next) => {
  try {
    const session = await RefreshToken.findByPk(req.params.id);
    if (!session) throw new NotFoundError("Sesión no encontrada");
    if (session.userId !== req.user.id) throw new UnauthorizedError();

    await session.update({ revokedAt: new Date() });
    res.json({ mensaje: "Sesión cerrada" });
  } catch (err) { next(err); }
};

// ─── Revocar todas excepto la actual ─────────────────────────
export const revokeAllSessions = async (req, res, next) => {
  try {
    const raw = req.cookies?.[COOKIE_NAME];
    const currentHash = raw ? hashToken(raw) : null;

    const where = {
      userId:    req.user.id,
      revokedAt: null,
    };
    if (currentHash) where.tokenHash = { [Op.ne]: currentHash };

    const [count] = await RefreshToken.update({ revokedAt: new Date() }, { where });
    res.json({ mensaje: `${count} sesión(es) cerrada(s)` });
  } catch (err) { next(err); }
};

// ─── Perfil del usuario autenticado ──────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "creado_en"],
    });
    res.json(usuario);
  } catch (err) { next(err); }
};
