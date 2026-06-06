import { DataTypes } from "sequelize";

export const RefreshTokenModel = (sequelize) => {
  return sequelize.define("RefreshToken", {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tokenHash:   { type: DataTypes.STRING(64), allowNull: false, unique: true },
    userId:      { type: DataTypes.INTEGER, allowNull: false },
    expiresAt:   { type: DataTypes.DATE, allowNull: false },
    revokedAt:   { type: DataTypes.DATE, defaultValue: null },
    userAgent:   { type: DataTypes.STRING(500) },
    ip:          { type: DataTypes.STRING(45) },
    lastUsedAt:  { type: DataTypes.DATE },
  }, { tableName: "refresh_tokens", timestamps: true });
};
