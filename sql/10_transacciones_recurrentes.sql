-- EV-06: Campos de recurrencia en la tabla Transaccions
-- Aplica si ya existe la tabla (migración); schema.sql incluye estos campos desde el principio.
ALTER TABLE `Transaccions`
  ADD COLUMN IF NOT EXISTS `recurrente`    TINYINT(1)                              NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `frecuencia`    ENUM('diario','semanal','mensual','anual') DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `proximaFecha`  DATETIME                                DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `recurrenciaId` INT                                     DEFAULT NULL;
