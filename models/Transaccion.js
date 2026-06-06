import { DataTypes } from "sequelize";

export const TransaccionModel = (sequelize) => {
  return sequelize.define("Transaccion", {
    id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name:     { type: DataTypes.STRING },
    units:    { type: DataTypes.FLOAT },
    price:    { type: DataTypes.FLOAT },
    total:    { type: DataTypes.FLOAT },
    type:          { type: DataTypes.ENUM("ingreso", "gasto", "traspaso") },
    category:      { type: DataTypes.STRING },
    date:          { type: DataTypes.DATE },
    notes:         { type: DataTypes.TEXT },
    groupId:       { type: DataTypes.INTEGER, allowNull: true },  // legacy
    cuentaId:      { type: DataTypes.INTEGER, allowNull: true },
    userId:        { type: DataTypes.INTEGER, allowNull: true },
    traspasoParId:  { type: DataTypes.INTEGER, allowNull: true },
    recurrente:       { type: DataTypes.BOOLEAN, defaultValue: false },
    frecuenciaValor:  { type: DataTypes.INTEGER, allowNull: true },
    frecuenciaUnidad: { type: DataTypes.ENUM('dia','mes','año'), allowNull: true },
    proximaFecha:     { type: DataTypes.DATE, allowNull: true },
    recurrenciaId:    { type: DataTypes.INTEGER, allowNull: true },
  });
};
