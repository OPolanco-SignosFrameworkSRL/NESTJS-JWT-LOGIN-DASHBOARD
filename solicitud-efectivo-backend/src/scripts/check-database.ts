import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function checkDatabase() {
  const logger = new Logger('DatabaseCheck');
  
  try {
    logger.log('Iniciando verificación de base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Verificar conexión
    logger.log('Verificando conexión a la base de datos...');
    await dataSource.query('SELECT 1');
    logger.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar vista vsolicitud_generales
    logger.log('Verificando vista vsolicitud_generales...');
    const cashRequestsCount = await dataSource.query('SELECT COUNT(*) as count FROM vsolicitud_generales');
    logger.log(`✅ Vista vsolicitud_generales encontrada con ${cashRequestsCount[0].count} registros`);
    
    // Verificar estructura de vista vsolicitud_generales
    logger.log('Verificando estructura de vista vsolicitud_generales...');
    const cashRequestsColumns = await dataSource.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'vsolicitud_generales'
      ORDER BY ORDINAL_POSITION
    `);
    logger.log('Columnas de vsolicitud_generales:');
    cashRequestsColumns.forEach(col => {
      logger.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? '[NULLABLE]' : '[NOT NULL]'}`);
    });
    
    // Mostrar algunos registros de ejemplo
    logger.log('Mostrando algunos registros de ejemplo...');
    const sampleRecords = await dataSource.query('SELECT TOP 3 * FROM vsolicitud_generales');
    logger.log('Registros de ejemplo:', JSON.stringify(sampleRecords, null, 2));
    
    await app.close();
    logger.log('✅ Verificación completada exitosamente');
    
  } catch (error) {
    logger.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

checkDatabase(); 