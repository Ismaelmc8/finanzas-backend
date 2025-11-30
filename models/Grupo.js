// models/Grupo.js
import { DataTypes } from "sequelize";

export const GrupoModel = (sequelize) => {
  const Grupo = sequelize.define("Grupo", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  Grupo.associate = (models) => {
    Grupo.hasMany(models.Transaccion, { foreignKey: "groupId", as: "transacciones" });
  };

  return Grupo;
};
