-- Requiere: 01_usuarios.sql, 04_cuentas.sql
CREATE TABLE IF NOT EXISTS `cuenta_accesos` (
  `id`          INT     NOT NULL AUTO_INCREMENT,
  `cuentaId`    INT     NOT NULL,
  `userId`      INT     NOT NULL,    -- usuario invitado
  `invitadoPor` INT     NOT NULL,    -- propietario
  `rol`         ENUM('editor','lector') NOT NULL,
  `estado`      ENUM('pendiente','aceptado','rechazado') NOT NULL DEFAULT 'pendiente',
  `createdAt`   DATETIME NOT NULL,
  `updatedAt`   DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cuenta_usuario` (`cuentaId`, `userId`),
  CONSTRAINT `fk_accesos_cuenta`
    FOREIGN KEY (`cuentaId`) REFERENCES `cuentas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_accesos_invitado`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_accesos_propietario`
    FOREIGN KEY (`invitadoPor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
