import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkViewDependencies() {
  console.log('🔍 Verificando dependencias de la vista vsolicitud_generales...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Obtener la definición de la vista
    const viewDefinition = await dataSource.query(`
      SELECT VIEW_DEFINITION 
      FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_NAME = 'vsolicitud_generales'
    `);
    
    if (viewDefinition.length === 0) {
      console.log('❌ No se encontró la vista vsolicitud_generales');
      return;
    }
    
    console.log('📋 Definición de la vista vsolicitud_generales:');
    console.log(viewDefinition[0].VIEW_DEFINITION);
    
    // Buscar tablas que podrían ser las base
    const possibleTables = await dataSource.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      AND TABLE_NAME LIKE '%solicitud%'
      ORDER BY TABLE_NAME
    `);
    
    console.log('📊 Tablas que podrían ser base:');
    possibleTables.forEach(table => {
      console.log(`  - ${table.TABLE_NAME}`);
    });
    
    // Buscar tablas que podrían estar relacionadas
    const relatedTables = await dataSource.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      AND (TABLE_NAME LIKE '%general%' OR TABLE_NAME LIKE '%request%' OR TABLE_NAME LIKE '%cash%')
      ORDER BY TABLE_NAME
    `);
    
    console.log('📊 Tablas relacionadas:');
    relatedTables.forEach(table => {
      console.log(`  - ${table.TABLE_NAME}`);
    });
    
    // Verificar si existe una tabla llamada 'solicitudes' o similar
    const solicitudesTable = await dataSource.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'solicitudes'
    `);
    
    if (solicitudesTable[0].count > 0) {
      console.log('✅ Tabla "solicitudes" encontrada');
      
      // Verificar estructura de la tabla solicitudes
      const columns = await dataSource.query(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'solicitudes'
        ORDER BY ORDINAL_POSITION
      `);
      
      console.log('📋 Estructura de la tabla solicitudes:');
      columns.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) [${col.IS_NULLABLE === 'YES' ? 'NULLABLE' : 'NOT NULL'}]`);
      });
      
      // Verificar algunos registros
      const records = await dataSource.query(`
        SELECT TOP 3 * FROM solicitudes ORDER BY id DESC
      `);
      
      console.log('📊 Registros de ejemplo de solicitudes:');
      console.log(JSON.stringify(records, null, 2));
    } else {
      console.log('❌ Tabla "solicitudes" no encontrada');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkViewDependencies(); 