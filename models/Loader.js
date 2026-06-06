import sequelize from "../config/db.js";
import { GrupoModel } from "./Grupo.js";
import { TransaccionModel } from "./Transaccion.js";
import { BancoModel } from "./Banco.js";
import { CuentaModel } from "./Cuenta.js";
import { RefreshTokenModel } from "./RefreshToken.js";
import Usuario from "./Usuario.js";

const Grupo        = GrupoModel(sequelize);
const Transaccion  = TransaccionModel(sequelize);
const Banco        = BancoModel(sequelize);
const Cuenta       = CuentaModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);

// Banco ↔ Usuario
Usuario.hasMany(Banco,   { foreignKey: "userId", onDelete: "CASCADE" });
Banco.belongsTo(Usuario, { foreignKey: "userId" });

// Cuenta ↔ Banco
Banco.hasMany(Cuenta,    { foreignKey: "bancoId", as: "cuentas", onDelete: "CASCADE" });
Cuenta.belongsTo(Banco,  { foreignKey: "bancoId", as: "banco" });

// Cuenta ↔ Usuario
Usuario.hasMany(Cuenta,   { foreignKey: "userId" });
Cuenta.belongsTo(Usuario, { foreignKey: "userId" });

// Transaccion ↔ Cuenta
Cuenta.hasMany(Transaccion,     { foreignKey: "cuentaId", as: "transacciones", onDelete: "CASCADE" });
Transaccion.belongsTo(Cuenta,   { foreignKey: "cuentaId", as: "cuenta" });

// Transaccion ↔ Grupo (legacy)
Grupo.hasMany(Transaccion,      { foreignKey: "groupId", as: "transaccionesGrupo" });
Transaccion.belongsTo(Grupo,    { foreignKey: "groupId", as: "grupo" });

// RefreshToken ↔ Usuario
Usuario.hasMany(RefreshToken,   { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(Usuario, { foreignKey: "userId" });

export { sequelize, Grupo, Transaccion, Banco, Cuenta, Usuario, RefreshToken };
