-- =============================================================
-- Tabla: presupuestos  (EV-05)
-- Límites de gasto mensual por categoría
-- cuentaId NULL → aplica a todas las cuentas del usuario
-- =============================================================

USE `finanzas_db`;

CREATE TABLE IF NOT EXISTS `presupuestos` (
  `id`          INT     NOT NULL AUTO_INCREMENT,
  `userId`      INT     NOT NULL,
  `categoriaId` INT     NOT NULL,
  `importe`     FLOAT   NOT NULL,
  `cuentaId`    INT     DEFAULT NULL,
  `createdAt`   DATETIME NOT NULL,
  `updatedAt`   DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_presupuesto` (`userId`, `categoriaId`, `cuentaId`),
  CONSTRAINT `fk_presupuesto_usuario`
    FOREIGN KEY (`userId`)      REFERENCES `usuarios`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_presupuesto_categoria`
    FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_presupuesto_cuenta`
    FOREIGN KEY (`cuentaId`)    REFERENCES `cuentas`    (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
