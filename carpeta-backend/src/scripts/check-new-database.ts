import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function checkNewDatabase() {
  const logger = new Logger('NewDatabaseCheck');
  
  try {
    logger.log('🔍 Verificando nueva base de datos DBSolicitudEfectivo_V1...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Cambiar a la nueva base de datos
    logger.log('1️⃣ Cambiando a DBSolicitudEfectivo_V1...');
    await dataSource.query('USE DBSolicitudEfectivo_V1');
    
    // Verificar base de datos actual
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // Verificar si las vistas existen en la nueva base de datos
    logger.log('2️⃣ Verificando vistas en la nueva base de datos...');
    
    const views = ['vappusuarios', 'vsolicitud_generales', 'vsolicitud_desembolso_web'];
    
    for (const viewName of views) {
      const viewExists = await dataSource.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.VIEWS 
        WHERE TABLE_NAME = '${viewName}'
      `);
      
      if (viewExists[0].count > 0) {
        logger.log(`✅ Vista ${viewName} existe en DBSolicitudEfectivo_V1`);
        
        // Contar registros en la vista
        const recordCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${viewName}`);
        logger.log(`   📊 Registros en ${viewName}: ${recordCount[0].count}`);
      } else {
        logger.log(`❌ Vista ${viewName} NO existe en DBSolicitudEfectivo_V1`);
      }
    }
    
    // Verificar tablas base
    logger.log('3️⃣ Verificando tablas base en la nueva base de datos...');
    
    const baseTables = ['solicitud_desembolso_web', 'usuarios', 'Appusuarios'];
    
    for (const tableName of baseTables) {
      const tableExists = await dataSource.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = '${tableName}'
      `);
      
      if (tableExists[0].count > 0) {
        logger.log(`✅ Tabla ${tableName} existe en DBSolicitudEfectivo_V1`);
        
        // Contar registros en la tabla
        const recordCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        logger.log(`   📊 Registros en ${tableName}: ${recordCount[0].count}`);
      } else {
        logger.log(`❌ Tabla ${tableName} NO existe en DBSolicitudEfectivo_V1`);
      }
    }
    
    await app.close();
    logger.log('✅ Verificación de nueva base de datos completada');
    
  } catch (error) {
    logger.error('❌ Error durante la verificación:', error);
    logger.error('Esto puede indicar que DBSolicitudEfectivo_V1 no existe o no es accesible');
    process.exit(1);
  }
}

checkNewDatabase();
