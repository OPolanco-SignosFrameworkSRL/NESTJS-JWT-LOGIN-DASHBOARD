import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function forceNewDatabase() {
  const logger = new Logger('ForceNewDatabase');
  
  try {
    logger.log('🔧 Forzando conexión a DbSolicitudEfectivo_v1...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Verificar base de datos actual
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // Si no está en la base de datos correcta, cambiarla
    if (currentDB[0].current_database !== 'DbSolicitudEfectivo_v1') {
      logger.log('🔄 Cambiando a DbSolicitudEfectivo_v1...');
      await dataSource.query('USE DbSolicitudEfectivo_v1');
      
      // Verificar el cambio
      const newDB = await dataSource.query('SELECT DB_NAME() as current_database');
      logger.log(`📊 Nueva base de datos: ${newDB[0].current_database}`);
    } else {
      logger.log('✅ Ya está conectado a DbSolicitudEfectivo_v1');
    }
    
    // Verificar que está vacía
    logger.log('\n📊 Verificando que la base de datos está vacía...');
    
    const userCount = await dataSource.query('SELECT COUNT(*) as count FROM Appusuarios');
    const requestCount = await dataSource.query('SELECT COUNT(*) as count FROM solicitud_desembolso_web');
    
    logger.log(`👥 Usuarios: ${userCount[0].count}`);
    logger.log(`📋 Solicitudes: ${requestCount[0].count}`);
    
    if (userCount[0].count === 0 && requestCount[0].count === 0) {
      logger.log('✅ Base de datos está completamente vacía - ¡Perfecto!');
      logger.log('🎯 Ahora puedes crear usuarios y solicitudes sin problemas de duplicados');
    } else {
      logger.log('⚠️ La base de datos no está completamente vacía');
    }
    
    await app.close();
    logger.log('✅ Configuración completada');
    
  } catch (error) {
    logger.error('❌ Error:', error);
    process.exit(1);
  }
}

forceNewDatabase();
