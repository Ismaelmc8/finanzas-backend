-- =============================================================
-- seed_categorias.sql
-- Inserta las categorías por defecto para todos los usuarios
-- que aún no tienen ninguna categoría.
--
-- Uso:
--   mysql -u finanzas_user -p finanzas_db < sql/seed_categorias.sql
--
-- Para un usuario concreto, sustituye la condición del cursor por:
--   WHERE u.id = <userId>
-- =============================================================

USE `finanzas_db`;

DELIMITER $$

DROP PROCEDURE IF EXISTS seed_categorias_usuario $$

CREATE PROCEDURE seed_categorias_usuario(IN p_userId INT)
BEGIN
  DECLARE raiz_id INT;

  -- ── Vivienda ────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Vivienda', 'gasto', '#f59e0b', '🏠', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Alquiler / Hipoteca', 'gasto', '#fbbf24', '🔑', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Electricidad',        'gasto', '#fbbf24', '💡', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Agua',                'gasto', '#fbbf24', '💧', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Gas / Calefacción',   'gasto', '#fbbf24', '🔥', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Internet / Teléfono', 'gasto', '#fbbf24', '📡', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Comunidad',           'gasto', '#fbbf24', '🏢', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Alimentación ────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Alimentación', 'gasto', '#10b981', '🛒', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Supermercado', 'gasto', '#34d399', '🛒', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Restaurantes', 'gasto', '#34d399', '🍽️', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Delivery',     'gasto', '#34d399', '🛵', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Cafetería',    'gasto', '#34d399', '☕', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Transporte ──────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Transporte', 'gasto', '#3b82f6', '🚗', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Gasolina',           'gasto', '#60a5fa', '⛽', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Transporte público', 'gasto', '#60a5fa', '🚇', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Taxi / Uber',        'gasto', '#60a5fa', '🚕', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Seguro vehículo',    'gasto', '#60a5fa', '🛡️', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Mantenimiento',      'gasto', '#60a5fa', '🔧', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Salud ───────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Salud', 'gasto', '#ef4444', '🏥', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Médico / Farmacia', 'gasto', '#f87171', '💊', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Seguro médico',     'gasto', '#f87171', '🩺', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Gimnasio',          'gasto', '#f87171', '💪', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Ocio ────────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Ocio', 'gasto', '#8b5cf6', '🎮', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Streaming',     'gasto', '#a78bfa', '📺', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Cine / Teatro', 'gasto', '#a78bfa', '🎬', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Viajes',        'gasto', '#a78bfa', '✈️', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Hobbies',       'gasto', '#a78bfa', '🎨', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Deporte',       'gasto', '#a78bfa', '⚽', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Ropa y calzado ──────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Ropa y calzado', 'gasto', '#f97316', '👗', NULL, p_userId, 1, NOW(), NOW());

  -- ── Educación ───────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Educación', 'gasto', '#14b8a6', '📚', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Cursos / Formación', 'gasto', '#2dd4bf', '🎓', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Libros / Material',  'gasto', '#2dd4bf', '📖', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Cuidado personal ────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Cuidado personal', 'gasto', '#ec4899', '💇', NULL, p_userId, 1, NOW(), NOW());

  -- ── Hogar ───────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Hogar', 'gasto', '#78716c', '🛋️', NULL, p_userId, 1, NOW(), NOW());
  SET raiz_id = LAST_INSERT_ID();
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Reparaciones',      'gasto', '#a8a29e', '🛠️', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Muebles / Deco',    'gasto', '#a8a29e', '🪑', raiz_id, p_userId, 1, NOW(), NOW()),
    ('Electrodomésticos', 'gasto', '#a8a29e', '🫙', raiz_id, p_userId, 1, NOW(), NOW());

  -- ── Mascotas ────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Mascotas', 'gasto', '#84cc16', '🐾', NULL, p_userId, 1, NOW(), NOW());

  -- ── Regalos ─────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Regalos', 'gasto', '#e879f9', '🎁', NULL, p_userId, 1, NOW(), NOW());

  -- ── Gastos bancarios ────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt)
    VALUES ('Gastos bancarios', 'gasto', '#64748b', '🏦', NULL, p_userId, 1, NOW(), NOW());

  -- ── Ingresos ────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Salario',        'ingreso', '#22c55e', '💰', NULL, p_userId, 1, NOW(), NOW()),
    ('Freelance',      'ingreso', '#4ade80', '💼', NULL, p_userId, 1, NOW(), NOW()),
    ('Inversiones',    'ingreso', '#86efac', '📈', NULL, p_userId, 1, NOW(), NOW()),
    ('Otros ingresos', 'ingreso', '#a7f3d0', '💵', NULL, p_userId, 1, NOW(), NOW());

  -- ── Ambos ───────────────────────────────────────────────────
  INSERT INTO categorias (nombre, tipo, color, icono, parentId, userId, activa, createdAt, updatedAt) VALUES
    ('Ahorro', 'ambos', '#6366f1', '🐷', NULL, p_userId, 1, NOW(), NOW()),
    ('Otros',  'ambos', '#94a3b8', '📦', NULL, p_userId, 1, NOW(), NOW());

END $$

-- =============================================================
-- Ejecutar el seed para todos los usuarios sin categorías
-- =============================================================
DROP PROCEDURE IF EXISTS seed_categorias_todos $$

CREATE PROCEDURE seed_categorias_todos()
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

    SELECT COUNT(*) INTO v_count FROM categorias WHERE userId = v_id;
    IF v_count = 0 THEN
      CALL seed_categorias_usuario(v_id);
    END IF;
  END LOOP;
  CLOSE cur;
END $$

DELIMITER ;

-- Ejecutar
CALL seed_categorias_todos();

-- Limpiar procedimientos tras el uso
DROP PROCEDURE IF EXISTS seed_categorias_todos;
DROP PROCEDURE IF EXISTS seed_categorias_usuario;
