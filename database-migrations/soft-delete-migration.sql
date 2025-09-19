-- =====================================================
-- MIGRACIÓN: Agregar campos de Soft Delete
-- =====================================================
-- 
-- Este script agrega los campos necesarios para implementar
-- soft delete en la tabla de usuarios.
--
-- IMPORTANTE: 
-- - Ejecutar solo una vez
-- - Hacer backup de la base de datos antes de ejecutar
-- - Reemplazar 'TU_BASE_DE_DATOS' con el nombre real de tu BD
--
-- =====================================================

USE [TU_BASE_DE_DATOS];
GO

-- Verificar si los campos ya existen
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'appusuarios' 
    AND COLUMN_NAME = 'deleted_at'
)
BEGIN
    -- Agregar campo deleted_at
    ALTER TABLE appusuarios 
    ADD deleted_at DATETIME NULL;
    
    PRINT 'Campo deleted_at agregado exitosamente';
END
ELSE
BEGIN
    PRINT 'Campo deleted_at ya existe';
END

-- Verificar si el campo deleted_by ya existe
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'appusuarios' 
    AND COLUMN_NAME = 'deleted_by'
)
BEGIN
    -- Agregar campo deleted_by
    ALTER TABLE appusuarios 
    ADD deleted_by INT NULL;
    
    PRINT 'Campo deleted_by agregado exitosamente';
END
ELSE
BEGIN
    PRINT 'Campo deleted_by ya existe';
END

-- Crear índice para mejorar performance en consultas de soft delete
IF NOT EXISTS (
    SELECT * FROM sys.indexes 
    WHERE name = 'IX_appusuarios_deleted_at' 
    AND object_id = OBJECT_ID('appusuarios')
)
BEGIN
    CREATE INDEX IX_appusuarios_deleted_at 
    ON appusuarios (deleted_at);
    
    PRINT 'Índice IX_appusuarios_deleted_at creado exitosamente';
END
ELSE
BEGIN
    PRINT 'Índice IX_appusuarios_deleted_at ya existe';
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

PRINT 'Migración completada. Verificar que los campos se agregaron correctamente.';
GO 