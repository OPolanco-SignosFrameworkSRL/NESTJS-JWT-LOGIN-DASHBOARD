-- Script para agregar campos de soft delete a la tabla appusuarios
-- Ejecutar este script en la base de datos para agregar los campos necesarios

-- Agregar campo deleted_at (fecha de eliminación)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'appusuarios' 
    AND COLUMN_NAME = 'deleted_at'
)
BEGIN
    ALTER TABLE appusuarios 
    ADD deleted_at DATETIME NULL;
    
    PRINT 'Campo deleted_at agregado exitosamente';
END
ELSE
BEGIN
    PRINT 'Campo deleted_at ya existe';
END

-- Agregar campo deleted_by (ID del usuario que realizó la eliminación)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'appusuarios' 
    AND COLUMN_NAME = 'deleted_by'
)
BEGIN
    ALTER TABLE appusuarios 
    ADD deleted_by INT NULL;
    
    PRINT 'Campo deleted_by agregado exitosamente';
END
ELSE
BEGIN
    PRINT 'Campo deleted_by ya existe';
END

-- Crear índice para mejorar el rendimiento de consultas de soft delete
IF NOT EXISTS (
    SELECT * FROM sys.indexes 
    WHERE name = 'IX_appusuarios_valido_deleted_at' 
    AND object_id = OBJECT_ID('appusuarios')
)
BEGIN
    CREATE INDEX IX_appusuarios_valido_deleted_at 
    ON appusuarios (valido, deleted_at);
    
    PRINT 'Índice IX_appusuarios_valido_deleted_at creado exitosamente';
END
ELSE
BEGIN
    PRINT 'Índice IX_appusuarios_valido_deleted_at ya existe';
END

-- Verificar que los campos se agregaron correctamente
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'appusuarios' 
AND COLUMN_NAME IN ('deleted_at', 'deleted_by')
ORDER BY COLUMN_NAME;

PRINT 'Script completado. Verificar que los campos se agregaron correctamente.'; 