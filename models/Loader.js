import sequelize from "../config/db.js";
import { GrupoModel } from "./Grupo.js";
import { TransaccionModel } from "./Transaccion.js";

// Inicializar modelos
const Grupo = GrupoModel(sequelize);
const Transaccion = TransaccionModel(sequelize);

// Guardamos en un objeto para pasarlo a associate
const models = { Grupo, Transaccion };

// Ejecutar las asociaciones definidas en cada modelo
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize, models, Grupo, Transaccion };
