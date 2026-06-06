import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Formato de token inválido" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
