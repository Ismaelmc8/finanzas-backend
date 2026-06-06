-- =============================================================
-- Tabla: categorias
-- Categorías y subcategorías de transacciones por usuario
-- =============================================================

USE `finanzas_db`;

CREATE TABLE IF NOT EXISTS `categorias` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `nombre`    VARCHAR(255) NOT NULL,
  `tipo`      ENUM('ingreso','gasto','ambos') NOT NULL DEFAULT 'gasto',
  `color`     VARCHAR(7)   NOT NULL DEFAULT '#6366f1',
  `icono`     VARCHAR(10)  NOT NULL DEFAULT '📦',
  `parentId`  INT          DEFAULT NULL,
  `userId`    INT          NOT NULL,
  `activa`    TINYINT(1)   NOT NULL DEFAULT 1,
  `createdAt` DATETIME     NOT NULL,
  `updatedAt` DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_categoria_padre`
    FOREIGN KEY (`parentId`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categoria_usuario`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
