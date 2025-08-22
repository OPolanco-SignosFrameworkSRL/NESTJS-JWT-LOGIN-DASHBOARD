import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function migrateMasterData() {
  const logger = new Logger('MigrateMasterData');
  
  try {
    logger.log('🔄 Migrando datos maestros a la nueva base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Verificar base de datos actual
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // Lista de tablas maestras que necesitan datos
    const masterTables = [
      'tipo_pagos',
      'solicitud_desembolso_web_tipos', 
      'solicitud_desembolso_web_status',
      'solicitud_desembolso_web_diviciones'
    ];
    
    for (const tableName of masterTables) {
      logger.log(`\n📋 Migrando tabla: ${tableName}`);
      
      // Verificar si la tabla existe en la nueva base de datos
      const tableExists = await dataSource.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = '${tableName}'
      `);
      
      if (tableExists[0].count === 0) {
        logger.log(`❌ Tabla ${tableName} no existe en la nueva base de datos`);
        continue;
      }
      
      // Contar registros actuales
      const currentCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      logger.log(`📊 Registros actuales en ${tableName}: ${currentCount[0].count}`);
      
      if (currentCount[0].count === 0) {
        logger.log(`🔄 La tabla ${tableName} está vacía, necesitamos migrar datos`);
        
        // Cambiar temporalmente a la base de datos antigua para obtener datos
        await dataSource.query('USE DbSolicitudEfectivo');
        
        // Obtener datos de la tabla maestra
        const masterData = await dataSource.query(`SELECT * FROM ${tableName}`);
        logger.log(`📥 Obtenidos ${masterData.length} registros de ${tableName}`);
        
        if (masterData.length > 0) {
          // Cambiar de vuelta a la nueva base de datos
          await dataSource.query('USE DbSolicitudEfectivo_v1');
          
          // Insertar datos en la nueva base de datos
          for (const record of masterData) {
            const columns = Object.keys(record).join(', ');
            const values = Object.values(record).map(v => 
              v === null ? 'NULL' : 
              typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
            ).join(', ');
            
            const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
            
            try {
              await dataSource.query(insertQuery);
              logger.log(`✅ Insertado registro en ${tableName}`);
            } catch (error) {
              logger.error(`❌ Error insertando en ${tableName}:`, error.message);
            }
          }
          
          logger.log(`✅ Migración completada para ${tableName}`);
        }
      } else {
        logger.log(`✅ La tabla ${tableName} ya tiene datos`);
      }
    }
    
    // Verificar el resultado final
    logger.log('\n📊 Verificación final de datos maestros:');
    for (const tableName of masterTables) {
      const finalCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      logger.log(`   ${tableName}: ${finalCount[0].count} registros`);
    }
    
    await app.close();
    logger.log('✅ Migración de datos maestros completada');
    
  } catch (error) {
    logger.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

migrateMasterData();
