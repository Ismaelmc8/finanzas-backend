import { DataTypes } from "sequelize";

export const BancoModel = (sequelize) => {
  return sequelize.define("Banco", {
    id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    color:  { type: DataTypes.STRING, defaultValue: "#6366f1" },
    icono:  { type: DataTypes.STRING, defaultValue: "🏦" },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: "bancos", timestamps: true });
};
