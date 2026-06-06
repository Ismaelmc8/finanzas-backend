import { DataTypes } from "sequelize";

export const CategoriaModel = (sequelize) => {
  return sequelize.define("Categoria", {
    id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre:   { type: DataTypes.STRING,  allowNull: false },
    tipo:     { type: DataTypes.ENUM("ingreso", "gasto", "ambos"), defaultValue: "gasto" },
    color:    { type: DataTypes.STRING(7), defaultValue: "#6366f1" },
    icono:    { type: DataTypes.STRING(10), defaultValue: "📦" },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    activa:   { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: "categorias", timestamps: true });
};
