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
--    · type='traspaso'  → movimiento interno entre cuentas
--    · traspasoParId    → enlaza el par de transacciones de un traspaso
--                         (ambas apuntan al id de la transacción saliente)
--    · cuentaId         → cuenta propietaria (nuevo)
--    · groupId          → Grupo legacy (nullable)
--    · userId           → desnormalizado para queries rápidas
-- -------------------------------------------------------------
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

-- -------------------------------------------------------------
-- 6. refresh_tokens  (EV-09)
--    · tokenHash   → SHA-256 del token, nunca texto plano
--    · revokedAt   → NULL = activo, fecha = revocado (blacklist)
--    · Rotación    → en cada uso se revoca el actual y se emite uno nuevo
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `tokenHash`   VARCHAR(64)   NOT NULL,
  `userId`      INT           NOT NULL,
  `expiresAt`   DATETIME      NOT NULL,
  `revokedAt`   DATETIME               DEFAULT NULL,
  `userAgent`   VARCHAR(500)           DEFAULT NULL,
  `ip`          VARCHAR(45)            DEFAULT NULL,
  `lastUsedAt`  DATETIME               DEFAULT NULL,
  `createdAt`   DATETIME      NOT NULL,
  `updatedAt`   DATETIME      NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_tokens_hash` (`tokenHash`),
  KEY `idx_refresh_tokens_userId` (`userId`),
  CONSTRAINT `fk_refresh_tokens_usuario`
    FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 8. categorias  (EV-04)
--    · parentId NULL → categoría raíz; parentId = id padre → subcategoría
--    · Máximo dos niveles (validado en el controller)
-- -------------------------------------------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 7. cuenta_accesos  (EV-03)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuenta_accesos` (
  `id`          INT     NOT NULL AUTO_INCREMENT,
  `cuentaId`    INT     NOT NULL,
  `userId`      INT     NOT NULL,
  `invitadoPor` INT     NOT NULL,
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
