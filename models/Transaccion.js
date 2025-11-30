// models/Transaccion.js
import { DataTypes } from "sequelize";

export const TransaccionModel = (sequelize) => {
  const Transaccion = sequelize.define("Transaccion", {
    name: DataTypes.STRING,
    units: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    type: DataTypes.ENUM("ingreso", "gasto"),
    category: DataTypes.STRING,
    date: DataTypes.DATE,
    notes: DataTypes.TEXT,
  });

  Transaccion.associate = (models) => {
    Transaccion.belongsTo(models.Grupo, { foreignKey: "groupId", as: "grupo" });
  };

  return Transaccion;
};
