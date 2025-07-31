-- =====================================================
-- CONSULTAS PARA VERIFICAR ESQUEMA Y DATOS DE appusuarios
-- =====================================================

-- 1. VERIFICAR ESQUEMA DE LA TABLA (TIPOS DE DATOS)
SELECT 
    COLUMN_NAME AS 'Nombre_Columna',
    DATA_TYPE AS 'Tipo_Dato',
    CHARACTER_MAXIMUM_LENGTH AS 'Longitud_Maxima',
    IS_NULLABLE AS 'Permite_Null',
    COLUMN_DEFAULT AS 'Valor_Por_Defecto',
    ORDINAL_POSITION AS 'Posicion'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'appusuarios'
ORDER BY ORDINAL_POSITION;

-- 2. VERIFICAR CONSTRAINTS Y CLAVES PRIMARIAS
SELECT 
    tc.CONSTRAINT_NAME AS 'Nombre_Constraint',
    tc.CONSTRAINT_TYPE AS 'Tipo_Constraint',
    kcu.COLUMN_NAME AS 'Columna'
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'appusuarios';

-- 3. VERIFICAR ÍNDICES
SELECT 
    i.name AS 'Nombre_Indice',
    c.name AS 'Columna',
    ic.is_descending_key AS 'Descendente',
    ic.key_ordinal AS 'Orden'
FROM sys.indexes i
JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE OBJECT_NAME(i.object_id) = 'appusuarios'
ORDER BY i.name, ic.key_ordinal;

-- 4. VER DATOS ACTUALES EN LA TABLA (PRIMEROS 10 REGISTROS)
SELECT TOP 10 *
FROM appusuarios
ORDER BY id DESC;

-- 5. CONTAR TOTAL DE REGISTROS
SELECT COUNT(*) AS 'Total_Registros'
FROM appusuarios;

-- 6. VER REGISTROS VÁLIDOS (valido = '1')
SELECT COUNT(*) AS 'Registros_Validos'
FROM appusuarios
WHERE valido = '1';

-- 7. VER REGISTROS INVÁLIDOS (valido = '0')
SELECT COUNT(*) AS 'Registros_Invalidos'
FROM appusuarios
WHERE valido = '0';

-- 8. VER EJEMPLO DE UN REGISTRO COMPLETO
SELECT TOP 1 *
FROM appusuarios
WHERE valido = '1'
ORDER BY id DESC;

-- 9. VERIFICAR SI HAY DUPLICADOS DE CÉDULA
SELECT 
    cedula,
    COUNT(*) AS 'Cantidad_Duplicados'
FROM appusuarios
GROUP BY cedula
HAVING COUNT(*) > 1;

-- 10. VER CAMPOS QUE PODRÍAN SER bigint (para identificar el problema)
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'appusuarios'
    AND DATA_TYPE IN ('bigint', 'int', 'smallint', 'tinyint')
ORDER BY ORDINAL_POSITION;

-- 11. VER CAMPOS QUE SON nvarchar (para comparar)
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'appusuarios'
    AND DATA_TYPE LIKE '%char%'
ORDER BY ORDINAL_POSITION; 