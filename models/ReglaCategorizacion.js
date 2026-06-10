import { DataTypes } from "sequelize";

export const ReglaCategoriaModel = (sequelize) => {
  return sequelize.define("ReglaCategorizacion", {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId:      { type: DataTypes.INTEGER, allowNull: false },
    patron:      { type: DataTypes.STRING,  allowNull: false },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: "reglas_categorizacion", timestamps: true });
};
