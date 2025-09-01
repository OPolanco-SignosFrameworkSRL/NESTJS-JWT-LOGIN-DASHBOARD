import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function testNewDatabase() {
  const logger = new Logger('NewDatabaseTest');
  
  try {
    logger.log('🧪 Probando funcionalidad con la nueva base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Verificar base de datos actual
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // Verificar que no hay usuarios
    logger.log('\n1️⃣ Verificando que no hay usuarios existentes...');
    const userCount = await dataSource.query('SELECT COUNT(*) as count FROM Appusuarios');
    logger.log(`📊 Usuarios en Appusuarios: ${userCount[0].count}`);
    
    if (userCount[0].count === 0) {
      logger.log('✅ Base de datos está vacía - perfecto para crear nuevos usuarios');
    } else {
      logger.log('⚠️ Hay usuarios existentes en la base de datos');
    }
    
    // Verificar que no hay solicitudes
    logger.log('\n2️⃣ Verificando que no hay solicitudes existentes...');
    const requestCount = await dataSource.query('SELECT COUNT(*) as count FROM solicitud_desembolso_web');
    logger.log(`📊 Solicitudes en solicitud_desembolso_web: ${requestCount[0].count}`);
    
    if (requestCount[0].count === 0) {
      logger.log('✅ No hay solicitudes existentes - perfecto para crear nuevas solicitudes');
    } else {
      logger.log('⚠️ Hay solicitudes existentes en la base de datos');
    }
    
    // Verificar estructura de tablas
    logger.log('\n3️⃣ Verificando estructura de tablas...');
    
    const appusuariosColumns = await dataSource.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Appusuarios'
      ORDER BY ORDINAL_POSITION
    `);
    
    logger.log('📋 Columnas de Appusuarios:');
    appusuariosColumns.forEach(col => {
      logger.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? '[NULLABLE]' : '[NOT NULL]'}`);
    });
    
    const solicitudColumns = await dataSource.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'solicitud_desembolso_web'
      ORDER BY ORDINAL_POSITION
    `);
    
    logger.log('\n📋 Columnas de solicitud_desembolso_web:');
    solicitudColumns.forEach(col => {
      logger.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? '[NULLABLE]' : '[NOT NULL]'}`);
    });
    
    // Verificar vistas
    logger.log('\n4️⃣ Verificando vistas...');
    
    const views = ['vappusuarios', 'vsolicitud_generales', 'vsolicitud_desembolso_web'];
    
    for (const viewName of views) {
      const viewCount = await dataSource.query(`SELECT COUNT(*) as count FROM ${viewName}`);
      logger.log(`📊 Registros en ${viewName}: ${viewCount[0].count}`);
    }
    
    logger.log('\n✅ Prueba completada - La nueva base de datos está lista para usar');
    logger.log('🎯 Ahora puedes:');
    logger.log('   - Crear usuarios nuevos sin problemas de duplicados');
    logger.log('   - Crear solicitudes de efectivo desde cero');
    logger.log('   - Trabajar con una base de datos limpia');
    
    await app.close();
    
  } catch (error) {
    logger.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

testNewDatabase();
