-- =============================================================
-- seed_reglas.sql
-- Inserta las reglas de auto-categorización por defecto para todos
-- los usuarios que aún no tienen ninguna regla configurada.
--
-- Uso:
--   mysql -u finanzas_user -p finanzas_db < sql/seed_reglas.sql
--
-- Para un usuario concreto:
--   CALL seed_reglas_usuario(<userId>);
-- =============================================================

USE `finanzas_db`;

DELIMITER $$

DROP PROCEDURE IF EXISTS seed_reglas_usuario $$

CREATE PROCEDURE seed_reglas_usuario(IN p_userId INT)
BEGIN
  DECLARE v_alim_id   INT DEFAULT NULL;
  DECLARE v_rest_id   INT DEFAULT NULL;
  DECLARE v_tran_id   INT DEFAULT NULL;
  DECLARE v_salu_id   INT DEFAULT NULL;
  DECLARE v_ocio_id   INT DEFAULT NULL;
  DECLARE v_hoga_id   INT DEFAULT NULL;
  DECLARE v_ropa_id   INT DEFAULT NULL;
  DECLARE v_educ_id   INT DEFAULT NULL;
  DECLARE v_sala_id   INT DEFAULT NULL;
  DECLARE v_gasb_id   INT DEFAULT NULL;
  -- subcategorías
  DECLARE v_supe_id   INT DEFAULT NULL;
  DECLARE v_deli_id   INT DEFAULT NULL;
  DECLARE v_cafe_id   INT DEFAULT NULL;
  DECLARE v_elec_id   INT DEFAULT NULL;
  DECLARE v_inet_id   INT DEFAULT NULL;
  DECLARE v_gaso_id   INT DEFAULT NULL;
  DECLARE v_tpub_id   INT DEFAULT NULL;
  DECLARE v_gim_id    INT DEFAULT NULL;
  DECLARE v_stre_id   INT DEFAULT NULL;
  -- categorías raíz adicionales
  DECLARE v_pers_id   INT DEFAULT NULL;
  DECLARE v_ahorro_id INT DEFAULT NULL;
  DECLARE v_otros_id  INT DEFAULT NULL;
  DECLARE v_otri_id   INT DEFAULT NULL;
  DECLARE v_curs_id   INT DEFAULT NULL;

  -- Buscar IDs de categorías del usuario (null si no existe)
  SELECT id INTO v_alim_id   FROM categorias WHERE userId = p_userId AND nombre = 'Alimentación'      AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_rest_id   FROM categorias WHERE userId = p_userId AND nombre = 'Restaurantes'      LIMIT 1;
  SELECT id INTO v_tran_id   FROM categorias WHERE userId = p_userId AND nombre = 'Transporte'        AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_salu_id   FROM categorias WHERE userId = p_userId AND nombre = 'Salud'             AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_ocio_id   FROM categorias WHERE userId = p_userId AND nombre = 'Ocio'              AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_hoga_id   FROM categorias WHERE userId = p_userId AND nombre = 'Hogar'             AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_ropa_id   FROM categorias WHERE userId = p_userId AND nombre = 'Ropa y calzado'    AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_educ_id   FROM categorias WHERE userId = p_userId AND nombre = 'Educación'         AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_sala_id   FROM categorias WHERE userId = p_userId AND nombre = 'Salario'           AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_gasb_id   FROM categorias WHERE userId = p_userId AND nombre = 'Gastos bancarios'  AND parentId IS NULL LIMIT 1;
  -- subcategorías
  SELECT id INTO v_supe_id   FROM categorias WHERE userId = p_userId AND nombre = 'Supermercado'      LIMIT 1;
  SELECT id INTO v_deli_id   FROM categorias WHERE userId = p_userId AND nombre = 'Delivery'          LIMIT 1;
  SELECT id INTO v_cafe_id   FROM categorias WHERE userId = p_userId AND nombre = 'Cafetería'         LIMIT 1;
  SELECT id INTO v_elec_id   FROM categorias WHERE userId = p_userId AND nombre = 'Electricidad'      LIMIT 1;
  SELECT id INTO v_inet_id   FROM categorias WHERE userId = p_userId AND nombre = 'Internet / Teléfono' LIMIT 1;
  SELECT id INTO v_gaso_id   FROM categorias WHERE userId = p_userId AND nombre = 'Gasolina'          LIMIT 1;
  SELECT id INTO v_tpub_id   FROM categorias WHERE userId = p_userId AND nombre = 'Transporte público' LIMIT 1;
  SELECT id INTO v_gim_id    FROM categorias WHERE userId = p_userId AND nombre = 'Gimnasio'          LIMIT 1;
  SELECT id INTO v_stre_id   FROM categorias WHERE userId = p_userId AND nombre = 'Streaming'         LIMIT 1;
  -- raíz adicionales
  SELECT id INTO v_pers_id   FROM categorias WHERE userId = p_userId AND nombre = 'Cuidado personal'  AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_ahorro_id FROM categorias WHERE userId = p_userId AND nombre = 'Ahorro'            AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_otros_id  FROM categorias WHERE userId = p_userId AND nombre = 'Otros'             AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_otri_id   FROM categorias WHERE userId = p_userId AND nombre = 'Otros ingresos'    AND parentId IS NULL LIMIT 1;
  SELECT id INTO v_curs_id   FROM categorias WHERE userId = p_userId AND nombre = 'Cursos / Formación' LIMIT 1;

  -- ── Alimentación ──────────────────────────────────────────────
  IF v_alim_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'MERCADONA',    v_alim_id, NOW(), NOW()),
      (p_userId, 'CARREFOUR',    v_alim_id, NOW(), NOW()),
      (p_userId, 'LIDL',         v_alim_id, NOW(), NOW()),
      (p_userId, 'ALDI',         v_alim_id, NOW(), NOW()),
      (p_userId, 'ALCAMPO',      v_alim_id, NOW(), NOW()),
      (p_userId, 'HIPERCOR',     v_alim_id, NOW(), NOW()),
      (p_userId, 'AHORRAMAS',    v_alim_id, NOW(), NOW()),
      (p_userId, 'CONSUM',       v_alim_id, NOW(), NOW()),
      (p_userId, 'EROSKI',       v_alim_id, NOW(), NOW()),
      (p_userId, 'BONPREU',      v_alim_id, NOW(), NOW()),
      (p_userId, 'FROIZ',        v_alim_id, NOW(), NOW()),
      (p_userId, 'SPAR ',        v_alim_id, NOW(), NOW()),
      (p_userId, 'SUPERMERCADO', v_alim_id, NOW(), NOW());
  END IF;

  -- ── Restaurantes (subcategoría de Alimentación) ───────────────
  IF v_rest_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'MCDONALD',    v_rest_id, NOW(), NOW()),
      (p_userId, 'BURGER KING', v_rest_id, NOW(), NOW()),
      (p_userId, 'KFC',         v_rest_id, NOW(), NOW()),
      (p_userId, 'TELEPIZZA',   v_rest_id, NOW(), NOW()),
      (p_userId, 'DOMINO',      v_rest_id, NOW(), NOW()),
      (p_userId, 'STARBUCKS',   v_rest_id, NOW(), NOW()),
      (p_userId, 'FIVE GUYS',   v_rest_id, NOW(), NOW()),
      (p_userId, 'GROSSO',      v_rest_id, NOW(), NOW()),
      (p_userId, 'RESTAURANTE', v_rest_id, NOW(), NOW()),
      (p_userId, 'CAFETERIA',   v_rest_id, NOW(), NOW());
  END IF;

  -- ── Transporte ────────────────────────────────────────────────
  IF v_tran_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'RENFE',      v_tran_id, NOW(), NOW()),
      (p_userId, 'CERCANIAS',  v_tran_id, NOW(), NOW()),
      (p_userId, 'METRO ',     v_tran_id, NOW(), NOW()),
      (p_userId, 'CABIFY',     v_tran_id, NOW(), NOW()),
      (p_userId, 'UBER ',      v_tran_id, NOW(), NOW()),
      (p_userId, 'BLABLACAR',  v_tran_id, NOW(), NOW()),
      (p_userId, 'BOLT ',      v_tran_id, NOW(), NOW()),
      (p_userId, 'EMT ',       v_tran_id, NOW(), NOW()),
      (p_userId, 'IBERIA',     v_tran_id, NOW(), NOW()),
      (p_userId, 'RYANAIR',    v_tran_id, NOW(), NOW()),
      (p_userId, 'VUELING',    v_tran_id, NOW(), NOW()),
      (p_userId, 'EASYJET',    v_tran_id, NOW(), NOW()),
      (p_userId, 'AENA',       v_tran_id, NOW(), NOW()),
      (p_userId, 'REPSOL',     v_tran_id, NOW(), NOW()),
      (p_userId, 'CEPSA',      v_tran_id, NOW(), NOW()),
      (p_userId, 'GASOLINERA', v_tran_id, NOW(), NOW());
  END IF;

  -- ── Salud ─────────────────────────────────────────────────────
  IF v_salu_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'FARMACIA',  v_salu_id, NOW(), NOW()),
      (p_userId, 'CLINICA',   v_salu_id, NOW(), NOW()),
      (p_userId, 'HOSPITAL',  v_salu_id, NOW(), NOW()),
      (p_userId, 'DENTISTA',  v_salu_id, NOW(), NOW()),
      (p_userId, 'SANITAS',   v_salu_id, NOW(), NOW()),
      (p_userId, 'ADESLAS',   v_salu_id, NOW(), NOW()),
      (p_userId, 'QUIRON',    v_salu_id, NOW(), NOW());
  END IF;

  -- ── Ocio ──────────────────────────────────────────────────────
  IF v_ocio_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'SPOTIFY',          v_ocio_id, NOW(), NOW()),
      (p_userId, 'NETFLIX',          v_ocio_id, NOW(), NOW()),
      (p_userId, 'HBO',              v_ocio_id, NOW(), NOW()),
      (p_userId, 'DISNEY',           v_ocio_id, NOW(), NOW()),
      (p_userId, 'AMAZON PRIME',     v_ocio_id, NOW(), NOW()),
      (p_userId, 'STEAM',            v_ocio_id, NOW(), NOW()),
      (p_userId, 'PLAYSTATION',      v_ocio_id, NOW(), NOW()),
      (p_userId, 'NINTENDO',         v_ocio_id, NOW(), NOW()),
      (p_userId, 'YOUTUBE PREMIUM',  v_ocio_id, NOW(), NOW()),
      (p_userId, 'TWITCH',           v_ocio_id, NOW(), NOW());
  END IF;

  -- ── Tecnología → Gastos bancarios (si no existe cat. propia) ──
  -- Apple, Google, Microsoft, telecos, tiendas tech
  IF v_gasb_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'APPLE',        v_gasb_id, NOW(), NOW()),
      (p_userId, 'GOOGLE',       v_gasb_id, NOW(), NOW()),
      (p_userId, 'MICROSOFT',    v_gasb_id, NOW(), NOW()),
      (p_userId, 'VODAFONE',     v_gasb_id, NOW(), NOW()),
      (p_userId, 'MOVISTAR',     v_gasb_id, NOW(), NOW()),
      (p_userId, 'ORANGE ',      v_gasb_id, NOW(), NOW()),
      (p_userId, 'YOIGO',        v_gasb_id, NOW(), NOW()),
      (p_userId, 'MASMOVIL',     v_gasb_id, NOW(), NOW()),
      (p_userId, 'MEDIAMARKT',   v_gasb_id, NOW(), NOW()),
      (p_userId, 'PCCOMPONENTES',v_gasb_id, NOW(), NOW());
  END IF;

  -- ── Hogar ─────────────────────────────────────────────────────
  IF v_hoga_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'IKEA',         v_hoga_id, NOW(), NOW()),
      (p_userId, 'LEROY MERLIN', v_hoga_id, NOW(), NOW()),
      (p_userId, 'BRICODEPOT',   v_hoga_id, NOW(), NOW()),
      (p_userId, 'ENDESA',       v_hoga_id, NOW(), NOW()),
      (p_userId, 'IBERDROLA',    v_hoga_id, NOW(), NOW()),
      (p_userId, 'NATURGY',      v_hoga_id, NOW(), NOW()),
      (p_userId, 'GAS NATURAL',  v_hoga_id, NOW(), NOW()),
      (p_userId, 'CANAL ISABEL', v_hoga_id, NOW(), NOW());
  END IF;

  -- ── Seguros → Gastos bancarios ────────────────────────────────
  IF v_gasb_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'MAPFRE',      v_gasb_id, NOW(), NOW()),
      (p_userId, 'AXA ',        v_gasb_id, NOW(), NOW()),
      (p_userId, 'ALLIANZ',     v_gasb_id, NOW(), NOW()),
      (p_userId, 'MUTUA ',      v_gasb_id, NOW(), NOW()),
      (p_userId, 'SANTA LUCIA', v_gasb_id, NOW(), NOW()),
      (p_userId, 'OCASO',       v_gasb_id, NOW(), NOW()),
      (p_userId, 'GENERALI',    v_gasb_id, NOW(), NOW());
  END IF;

  -- ── Ropa y calzado ────────────────────────────────────────────
  IF v_ropa_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ZARA ',        v_ropa_id, NOW(), NOW()),
      (p_userId, 'MANGO ',       v_ropa_id, NOW(), NOW()),
      (p_userId, 'H&M',          v_ropa_id, NOW(), NOW()),
      (p_userId, 'BERSHKA',      v_ropa_id, NOW(), NOW()),
      (p_userId, 'PRIMARK',      v_ropa_id, NOW(), NOW()),
      (p_userId, 'DECATHLON',    v_ropa_id, NOW(), NOW()),
      (p_userId, 'NIKE ',        v_ropa_id, NOW(), NOW()),
      (p_userId, 'ADIDAS',       v_ropa_id, NOW(), NOW()),
      (p_userId, 'PULL&BEAR',    v_ropa_id, NOW(), NOW()),
      (p_userId, 'STRADIVARIUS', v_ropa_id, NOW(), NOW());
  END IF;

  -- ── Educación ─────────────────────────────────────────────────
  IF v_educ_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'UDEMY',     v_educ_id, NOW(), NOW()),
      (p_userId, 'COURSERA',  v_educ_id, NOW(), NOW()),
      (p_userId, 'ACADEMIA ', v_educ_id, NOW(), NOW());
  END IF;

  -- ── Salario ───────────────────────────────────────────────────
  IF v_sala_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'NOMINA',      v_sala_id, NOW(), NOW()),
      (p_userId, 'SALARIO',     v_sala_id, NOW(), NOW()),
      (p_userId, 'PAGO NOMINA', v_sala_id, NOW(), NOW());
  END IF;

  -- ── Supermercado (subcategoría de Alimentación) ───────────────
  IF v_supe_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'SORLI',              v_supe_id, NOW(), NOW()),
      (p_userId, 'CONDIS',             v_supe_id, NOW(), NOW()),
      (p_userId, 'DIA ',               v_supe_id, NOW(), NOW()),
      (p_userId, 'BON AREA',           v_supe_id, NOW(), NOW()),
      (p_userId, 'CARNISSERIA',        v_supe_id, NOW(), NOW()),
      (p_userId, 'FRUITES I VERDURES', v_supe_id, NOW(), NOW()),
      (p_userId, 'AUTO SERVICIO',      v_supe_id, NOW(), NOW()),
      (p_userId, 'T352 GUISSONA',      v_supe_id, NOW(), NOW()),
      (p_userId, 'NESPRESSO',          v_supe_id, NOW(), NOW());
  END IF;

  -- ── Delivery (subcategoría de Alimentación) ───────────────────
  IF v_deli_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'JUST EAT', v_deli_id, NOW(), NOW());
  END IF;

  -- ── Cafetería (subcategoría de Alimentación) ──────────────────
  IF v_cafe_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'BAR TRIGAL',   v_cafe_id, NOW(), NOW()),
      (p_userId, 'PANET',        v_cafe_id, NOW(), NOW()),
      (p_userId, 'MACXIPA',      v_cafe_id, NOW(), NOW()),
      (p_userId, 'PASTISSERIA',  v_cafe_id, NOW(), NOW()),
      (p_userId, 'BUENAS MIGAS', v_cafe_id, NOW(), NOW()),
      (p_userId, 'GELATIAMO',    v_cafe_id, NOW(), NOW());
  END IF;

  -- ── Restaurantes (ampliación) ─────────────────────────────────
  IF v_rest_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'MAS QUE SUSHI',     v_rest_id, NOW(), NOW()),
      (p_userId, 'ELTERO',            v_rest_id, NOW(), NOW()),
      (p_userId, 'GINO',              v_rest_id, NOW(), NOW()),
      (p_userId, 'GALLEGO ARAGON',    v_rest_id, NOW(), NOW()),
      (p_userId, 'DASHU',             v_rest_id, NOW(), NOW()),
      (p_userId, 'T CHAMPIONS BURGER',v_rest_id, NOW(), NOW()),
      (p_userId, 'FOSTERS HOLLYWOOD', v_rest_id, NOW(), NOW()),
      (p_userId, 'REST CAN GARRIGA',  v_rest_id, NOW(), NOW()),
      (p_userId, 'EL REBOST',         v_rest_id, NOW(), NOW()),
      (p_userId, 'O'' CANTO',         v_rest_id, NOW(), NOW()),
      (p_userId, 'VIENA MATARO',      v_rest_id, NOW(), NOW()),
      (p_userId, 'FRANKFURTS',        v_rest_id, NOW(), NOW()),
      (p_userId, 'KILAUEA',           v_rest_id, NOW(), NOW()),
      (p_userId, 'KEDKE',             v_rest_id, NOW(), NOW()),
      (p_userId, 'ILLA CROUS',        v_rest_id, NOW(), NOW()),
      (p_userId, 'IKEA BADALONA FOOD',v_rest_id, NOW(), NOW());
  END IF;

  -- ── Streaming (subcategoría de Ocio) ──────────────────────────
  IF v_stre_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'YOUTUBEPREMIUM', v_stre_id, NOW(), NOW()),
      (p_userId, 'YOUTUBE',        v_stre_id, NOW(), NOW());
  END IF;

  -- ── Ocio (ampliación) ─────────────────────────────────────────
  IF v_ocio_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ACUARIUM',                       v_ocio_id, NOW(), NOW()),
      (p_userId, 'SHISHA',                         v_ocio_id, NOW(), NOW()),
      (p_userId, 'VIP DISTRICT',                   v_ocio_id, NOW(), NOW()),
      (p_userId, 'AGENCIA CATALANA DE LA JOVENTUT',v_ocio_id, NOW(), NOW());
  END IF;

  -- ── Electricidad (subcategoría de Vivienda) ───────────────────
  IF v_elec_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ENDESA',    v_elec_id, NOW(), NOW()),
      (p_userId, 'IBERDROLA', v_elec_id, NOW(), NOW());
  END IF;

  -- ── Internet / Teléfono (subcategoría de Vivienda) ────────────
  IF v_inet_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'O2 FIBRA',   v_inet_id, NOW(), NOW()),
      (p_userId, 'TELEFONICA', v_inet_id, NOW(), NOW()),
      (p_userId, 'VODAFONE',   v_inet_id, NOW(), NOW());
  END IF;

  -- ── Gasolina (subcategoría de Transporte) ─────────────────────
  IF v_gaso_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'PETROPRIX', v_gaso_id, NOW(), NOW());
  END IF;

  -- ── Transporte público (subcategoría de Transporte) ───────────
  IF v_tpub_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'TMB', v_tpub_id, NOW(), NOW());
  END IF;

  -- ── Transporte (aparcamiento) ─────────────────────────────────
  IF v_tran_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'WESMARTPARK', v_tran_id, NOW(), NOW());
  END IF;

  -- ── Gimnasio (subcategoría de Salud) ──────────────────────────
  IF v_gim_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ESPORTIU',   v_gim_id, NOW(), NOW()),
      (p_userId, 'LLINARSPORT',v_gim_id, NOW(), NOW());
  END IF;

  -- ── Cuidado personal ──────────────────────────────────────────
  IF v_pers_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'PELUKERIA',  v_pers_id, NOW(), NOW()),
      (p_userId, 'PERRUQUERIA',v_pers_id, NOW(), NOW()),
      (p_userId, 'BARBERIA',   v_pers_id, NOW(), NOW()),
      (p_userId, 'PELUQUERIA', v_pers_id, NOW(), NOW());
  END IF;

  -- ── Ropa y calzado (ampliación) ───────────────────────────────
  IF v_ropa_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'UNIQLO',   v_ropa_id, NOW(), NOW()),
      (p_userId, 'BOUTIQUE', v_ropa_id, NOW(), NOW());
  END IF;

  -- ── Hogar (ampliación) ────────────────────────────────────────
  IF v_hoga_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ROLSER',      v_hoga_id, NOW(), NOW()),
      (p_userId, 'WWW.AMAZON',  v_hoga_id, NOW(), NOW());
  END IF;

  -- ── Cursos / Formación (subcategoría de Educación) ────────────
  IF v_curs_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ANTHROPIC', v_curs_id, NOW(), NOW()),
      (p_userId, 'CURSOR',    v_curs_id, NOW(), NOW());
  END IF;

  -- ── Gastos bancarios (ampliación) ─────────────────────────────
  IF v_gasb_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'ESTARSEGURO',        v_gasb_id, NOW(), NOW()),
      (p_userId, 'AMORTIZACION',       v_gasb_id, NOW(), NOW()),
      (p_userId, 'AJ. LLINARS',        v_gasb_id, NOW(), NOW()),
      (p_userId, 'RETENCION PROMOCION',v_gasb_id, NOW(), NOW()),
      (p_userId, 'RET. EFECTIVO',      v_gasb_id, NOW(), NOW());
  END IF;

  -- ── Ahorro ────────────────────────────────────────────────────
  IF v_ahorro_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'TRASPASO A CUENTA',    v_ahorro_id, NOW(), NOW()),
      (p_userId, 'TRASPASO DESDE CUENTA',v_ahorro_id, NOW(), NOW());
  END IF;

  -- ── Otros ingresos ────────────────────────────────────────────
  IF v_otri_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'TRANSFERENCIA RECIBIDA', v_otri_id, NOW(), NOW()),
      (p_userId, 'CASHBACK PROMOCION',     v_otri_id, NOW(), NOW());
  END IF;

  -- ── Otros ─────────────────────────────────────────────────────
  IF v_otros_id IS NOT NULL THEN
    INSERT INTO reglas_categorizacion (userId, patron, categoriaId, createdAt, updatedAt) VALUES
      (p_userId, 'BIZUM',                  v_otros_id, NOW(), NOW()),
      (p_userId, 'TRANSFERENCIA REALIZADA',v_otros_id, NOW(), NOW());
  END IF;

END $$

-- =============================================================
-- Ejecutar el seed para todos los usuarios sin reglas
-- =============================================================
DROP PROCEDURE IF EXISTS seed_reglas_todos $$

CREATE PROCEDURE seed_reglas_todos()
BEGIN
  DECLARE done    INT DEFAULT FALSE;
  DECLARE v_id    INT;
  DECLARE v_count INT;

  DECLARE cur CURSOR FOR
    SELECT id FROM usuarios;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;
  loop_usuarios: LOOP
    FETCH cur INTO v_id;
    IF done THEN LEAVE loop_usuarios; END IF;

    SELECT COUNT(*) INTO v_count FROM reglas_categorizacion WHERE userId = v_id;
    IF v_count = 0 THEN
      CALL seed_reglas_usuario(v_id);
    END IF;
  END LOOP;
  CLOSE cur;
END $$

DELIMITER ;

-- Ejecutar
CALL seed_reglas_todos();

-- Limpiar procedimientos tras el uso
DROP PROCEDURE IF EXISTS seed_reglas_todos;
DROP PROCEDURE IF EXISTS seed_reglas_usuario;
