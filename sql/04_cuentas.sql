-- Requiere: 01_usuarios.sql, 03_bancos.sql
CREATE TABLE IF NOT EXISTS `cuentas` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(255)  NOT NULL,
  `tipo`        ENUM('corriente','ahorro','inversion','otro')
                              NOT NULL DEFAULT 'corriente',
  `balance`     FLOAT                  DEFAULT 0,
  `moneda`      VARCHAR(10)            DEFAULT 'EUR',
  `activa`      TINYINT(1)             DEFAULT 1,
  `bancoId`     INT           NOT NULL,
  `userId`      INT           NOT NULL,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cuentas_banco`
    FOREIGN KEY (`bancoId`) REFERENCES `bancos` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cuentas_usuario`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
