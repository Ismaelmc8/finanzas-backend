-- Legacy: reemplazado por bancos/cuentas en EV-01.
-- Se mantiene para compatibilidad con datos existentes.
CREATE TABLE IF NOT EXISTS `Grupos` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)  NOT NULL,
  `balance`     FLOAT                  DEFAULT 0,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
