-- EV-06: Campos de recurrencia en la tabla Transaccions
-- frecuenciaValor + frecuenciaUnidad reemplazan el ENUM anterior (más flexible: cada N días/meses/años)
ALTER TABLE `Transaccions`
  ADD COLUMN IF NOT EXISTS `recurrente`       TINYINT(1)               NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `frecuenciaValor`  INT                      DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `frecuenciaUnidad` ENUM('dia','mes','año')  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `proximaFecha`     DATETIME                 DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `recurrenciaId`    INT                      DEFAULT NULL;
