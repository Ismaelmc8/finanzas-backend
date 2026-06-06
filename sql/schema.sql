-- =============================================================
-- Finanzas — esquema completo de base de datos
-- Motor: MySQL 8+ / MariaDB 10.6+
-- Orden: respeta dependencias de claves foráneas
-- =============================================================

CREATE DATABASE IF NOT EXISTS `finanzas`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `finanzas`;

-- -------------------------------------------------------------
-- 1. usuarios
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `nombre`          VARCHAR(255)  NOT NULL,
  `email`           VARCHAR(255)  NOT NULL,
  `password_hash`   VARCHAR(255)  NOT NULL,
  `creado_en`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 2. Grupos  (legacy — reemplazado por bancos/cuentas en EV-01)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Grupos` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)  NOT NULL,
  `balance`     FLOAT                  DEFAULT 0,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 3. bancos
-- -------------------------------------------------------------
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

-- -------------------------------------------------------------
-- 4. cuentas
-- -------------------------------------------------------------
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

-- -------------------------------------------------------------
-- 5. Transaccions
--    · cuentaId  → cuenta propietaria (nuevo)
--    · groupId   → Grupo legacy (nullable)
--    · userId    → desnormalizado para queries rápidas
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Transaccions` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)           DEFAULT NULL,
  `units`       FLOAT                  DEFAULT NULL,
  `price`       FLOAT                  DEFAULT NULL,
  `total`       FLOAT                  DEFAULT NULL,
  `type`        ENUM('ingreso','gasto') DEFAULT NULL,
  `category`    VARCHAR(255)           DEFAULT NULL,
  `date`        DATETIME               DEFAULT NULL,
  `notes`       TEXT                   DEFAULT NULL,
  `groupId`     INT                    DEFAULT NULL,
  `cuentaId`    INT                    DEFAULT NULL,
  `userId`      INT                    DEFAULT NULL,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
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
