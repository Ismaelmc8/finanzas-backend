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
