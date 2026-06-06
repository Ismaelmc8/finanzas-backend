-- Requiere: 01_usuarios.sql
--
-- tokenHash: SHA-256 del refresh token. Nunca se guarda el token en texto plano.
-- revokedAt: NULL = sesión activa. Fecha = revocada (blacklist).
-- Rotación: en cada uso se revoca el token actual y se emite uno nuevo.
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
