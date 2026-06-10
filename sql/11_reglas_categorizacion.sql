CREATE TABLE IF NOT EXISTS `reglas_categorizacion` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `userId`       INT          NOT NULL,
  `patron`       VARCHAR(255) NOT NULL,
  `categoriaId`  INT          NOT NULL,
  `createdAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reglas_user` (`userId`),
  CONSTRAINT `fk_reglas_user`      FOREIGN KEY (`userId`)      REFERENCES `Usuarios`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reglas_categoria` FOREIGN KEY (`categoriaId`) REFERENCES `Categorias`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
