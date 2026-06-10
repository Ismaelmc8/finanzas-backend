import { DataTypes } from "sequelize";

export const CuentaModel = (sequelize) => {
  return sequelize.define("Cuenta", {
    id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre:  { type: DataTypes.STRING, allowNull: false },
    tipo:    { type: DataTypes.ENUM("corriente", "ahorro", "inversion", "otro"), defaultValue: "corriente" },
    balance:       { type: DataTypes.FLOAT, defaultValue: 0 },
    saldoInicial:  { type: DataTypes.FLOAT, defaultValue: 0 },
    moneda:  { type: DataTypes.STRING, defaultValue: "EUR" },
    activa:  { type: DataTypes.BOOLEAN, defaultValue: true },
    bancoId: { type: DataTypes.INTEGER, allowNull: false },
    userId:  { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: "cuentas", timestamps: true });
};
