// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from "./config/db.js";
import transaccionesRoutes from './routes/transacciones.js';
import authRoutes from './routes/authentication.js';
import Usuario from "./models/Usuario.js";
import gruposRoutes from "./routes/grupos.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.url.startsWith("/api")) {
    req.url = req.url.replace(/^\/api/, ""); // 👈 elimina solo el prefijo inicial /api
  }
  next();
});
app.use('/auth', authRoutes);
app.use('/expenses', transaccionesRoutes);
app.use("/groups-expenses", gruposRoutes);

await sequelize.sync({ alter: true });
// Conexión a la DB y arrancar servidor
sequelize.authenticate()
    .then(() => {
        console.log('Conectado a MySQL con Sequelize');
        return sequelize.sync(); // Sincroniza modelos
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => console.log('Error DB:', err));





