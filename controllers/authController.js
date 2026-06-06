import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ValidationError } from "../errors/index.js";

export const getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "creado_en"],
    });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) throw new ValidationError('El email ya está registrado');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const usuario = await Usuario.create({ nombre, email, password_hash });

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) throw new ValidationError('Credenciales incorrectas');

    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) throw new ValidationError('Credenciales incorrectas');

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    next(error);
  }
};
