import { DataTypes } from "sequelize";

export const CuentaAccesoModel = (sequelize) => {
  return sequelize.define("CuentaAcceso", {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cuentaId:    { type: DataTypes.INTEGER, allowNull: false },
    userId:      { type: DataTypes.INTEGER, allowNull: false },   // usuario invitado
    invitadoPor: { type: DataTypes.INTEGER, allowNull: false },   // propietario
    rol:         { type: DataTypes.ENUM("editor", "lector"), allowNull: false },
    estado:      { type: DataTypes.ENUM("pendiente", "aceptado", "rechazado"), defaultValue: "pendiente" },
  }, { tableName: "cuenta_accesos", timestamps: true });
};
