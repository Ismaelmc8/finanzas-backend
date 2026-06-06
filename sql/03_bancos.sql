-- Requiere: 01_usuarios.sql
CREATE TABLE IF NOT EXISTS `bancos` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(255)  NOT NULL,
  `color`       VARCHAR(255)           DEFAULT '#6366f1',
  `icono`       VARCHAR(255)           DEFAULT '🏦',
  `userId`      INT           NOT NULL,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bancos_usuario`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
