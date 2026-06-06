// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from "./config/db.js";
import transaccionesRoutes from './routes/transacciones.js';
import authRoutes from './routes/authentication.js';
import gruposRoutes from "./routes/grupos.js";
import bancosRoutes from "./routes/bancos.js";
import cuentasRoutes from "./routes/cuentas.js";
import traspasosRoutes from "./routes/traspasos.js";
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.url.startsWith("/api")) {
    req.url = req.url.replace(/^\/api/, ""); // 👈 elimina solo el prefijo inicial /api
  }
  next();
});
app.use('/auth', authRoutes);
app.use('/expenses', transaccionesRoutes);
app.use("/groups-expenses", gruposRoutes);
app.use("/bancos", bancosRoutes);
app.use("/cuentas", cuentasRoutes);
app.use("/traspasos", traspasosRoutes);

app.use(errorHandler);

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a MySQL con Sequelize');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => console.error('Error DB:', err));





