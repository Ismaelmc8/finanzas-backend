import { DataTypes } from "sequelize";

export const PresupuestoModel = (sequelize) => {
  return sequelize.define("Presupuesto", {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId:      { type: DataTypes.INTEGER, allowNull: false },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false },
    importe:     { type: DataTypes.FLOAT,   allowNull: false },
    cuentaId:    { type: DataTypes.INTEGER, allowNull: true },  // null = todas las cuentas
  }, { tableName: "presupuestos", timestamps: true });
};
