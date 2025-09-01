import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function diagnoseDatabase() {
  const logger = new Logger('DatabaseDiagnosis');
  
  try {
    logger.log('🔍 Iniciando diagnóstico completo de la base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // 1. Verificar conexión
    logger.log('1️⃣ Verificando conexión a la base de datos...');
    await dataSource.query('SELECT 1');
    logger.log('✅ Conexión exitosa');
    
    // 2. Verificar base de datos actual
    logger.log('2️⃣ Verificando base de datos actual...');
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // 3. Verificar si las vistas existen
    logger.log('3️⃣ Verificando existencia de vistas...');
    
    const views = ['vappusuarios', 'vsolicitud_generales', 'vsolicitud_desembolso_web'];
    
    for (const viewName of views) {
      const viewExists = await dataSource.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.VIEWS 
        WHERE TABLE_NAME = '${viewName}'
      `);
      
      if (viewExists[0].count > 0) {
        logger.log(`✅ Vista ${viewName} existe`);
        
        // Contar registros en la vista
        const recordCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${viewName}`);
        logger.log(`   📊 Registros en ${viewName}: ${recordCount[0].count}`);
        
        // Mostrar algunos registros de ejemplo
        if (recordCount[0].count > 0) {
          const sampleRecords = await dataSource.query(`SELECT TOP 2 * FROM ${viewName}`);
          logger.log(`   📋 Ejemplos de registros en ${viewName}:`);
          sampleRecords.forEach((record, index) => {
            logger.log(`      ${index + 1}. ${JSON.stringify(record, null, 2)}`);
          });
        }
      } else {
        logger.log(`❌ Vista ${viewName} NO existe`);
      }
    }
    
    // 4. Verificar tablas base
    logger.log('4️⃣ Verificando tablas base...');
    
    const baseTables = ['solicitud_desembolso_web', 'usuarios'];
    
    for (const tableName of baseTables) {
      const tableExists = await dataSource.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = '${tableName}'
      `);
      
      if (tableExists[0].count > 0) {
        logger.log(`✅ Tabla ${tableName} existe`);
        
        // Contar registros en la tabla
        const recordCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        logger.log(`   📊 Registros en ${tableName}: ${recordCount[0].count}`);
      } else {
        logger.log(`❌ Tabla ${tableName} NO existe`);
      }
    }
    
    // 5. Verificar definición de vistas
    logger.log('5️⃣ Verificando definición de vistas...');
    
    for (const viewName of views) {
      const viewDefinition = await dataSource.query(`
        SELECT VIEW_DEFINITION 
        FROM INFORMATION_SCHEMA.VIEWS 
        WHERE TABLE_NAME = '${viewName}'
      `);
      
      if (viewDefinition.length > 0) {
        logger.log(`📋 Definición de ${viewName}:`);
        logger.log(viewDefinition[0].VIEW_DEFINITION);
      }
    }
    
    await app.close();
    logger.log('✅ Diagnóstico completado');
    
  } catch (error) {
    logger.error('❌ Error durante el diagnóstico:', error);
    process.exit(1);
  }
}

diagnoseDatabase();
