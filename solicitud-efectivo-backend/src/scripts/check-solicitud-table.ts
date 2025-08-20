import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkSolicitudTable() {
  console.log('🔍 Verificando tabla solicitud_generales...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar si la tabla existe
    const tableExists = await dataSource.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'solicitud_generales'
    `);
    
    if (tableExists[0].count === 0) {
      console.log('❌ La tabla solicitud_generales no existe');
      return;
    }
    
    console.log('✅ Tabla solicitud_generales encontrada');
    
    // Obtener estructura de la tabla
    const columns = await dataSource.query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'solicitud_generales'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📋 Estructura de la tabla solicitud_generales:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) [${col.IS_NULLABLE === 'YES' ? 'NULLABLE' : 'NOT NULL'}]`);
    });
    
    // Verificar algunos registros
    const records = await dataSource.query(`
      SELECT TOP 3 * FROM solicitud_generales ORDER BY id DESC
    `);
    
    console.log('📊 Registros de ejemplo:');
    console.log(JSON.stringify(records, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkSolicitudTable(); 