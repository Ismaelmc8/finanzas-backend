-- Requiere: 01_usuarios.sql, 02_grupos.sql, 04_cuentas.sql
--
-- traspasoParId: enlaza las dos transacciones de un mismo traspaso.
-- Ambas apuntan al id de la transacción saliente (id de la primera creada).
-- Para borrar un traspaso completo: DELETE WHERE traspasoParId = :parId
CREATE TABLE IF NOT EXISTS `Transaccions` (
  `id`            INT             NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(255)             DEFAULT NULL,
  `units`         FLOAT                    DEFAULT NULL,
  `price`         FLOAT                    DEFAULT NULL,
  `total`         FLOAT                    DEFAULT NULL,
  `type`          ENUM('ingreso','gasto','traspaso') DEFAULT NULL,
  `category`      VARCHAR(255)             DEFAULT NULL,
  `date`          DATETIME                 DEFAULT NULL,
  `notes`         TEXT                     DEFAULT NULL,
  `groupId`       INT                      DEFAULT NULL,
  `cuentaId`      INT                      DEFAULT NULL,
  `userId`        INT                      DEFAULT NULL,
  `traspasoParId` INT                      DEFAULT NULL,
  `createdAt`     DATETIME        NOT NULL,
  `updatedAt`     DATETIME        NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_transaccions_cuenta`
    FOREIGN KEY (`cuentaId`) REFERENCES `cuentas` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transaccions_grupo`
    FOREIGN KEY (`groupId`) REFERENCES `Grupos` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transaccions_usuario`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
