-- =============================================================
-- Finanzas — eliminar todas las tablas
-- Ejecutar antes de schema.sql para hacer una reinstalación limpia
-- Orden inverso al de creación (respeta claves foráneas)
-- =============================================================

USE `finanzas_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `presupuestos`;
DROP TABLE IF EXISTS `cuenta_accesos`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `Transaccions`;
DROP TABLE IF EXISTS `cuentas`;
DROP TABLE IF EXISTS `bancos`;
DROP TABLE IF EXISTS `Grupos`;
DROP TABLE IF EXISTS `usuarios`;

SET FOREIGN_KEY_CHECKS = 1;
