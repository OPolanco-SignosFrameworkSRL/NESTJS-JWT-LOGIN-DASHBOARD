import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkRequestStatuses() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Verificando Estados de Solicitud Disponibles\n');

    // Verificar si existe la tabla de estados
    console.log(`📋 Verificando tabla solicitud_desembolso_web_status:`);
    try {
      const statusTableQuery = `
        SELECT TABLE_NAME, TABLE_TYPE
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'solicitud_desembolso_web_status'
      `;
      const statusTableResult = await dataSource.query(statusTableQuery);
      
      if (statusTableResult.length > 0) {
        console.log(`   ✅ Tabla solicitud_desembolso_web_status existe`);
        
        // Obtener todos los estados
        const statusesQuery = `
          SELECT * FROM solicitud_desembolso_web_status 
          ORDER BY id
        `;
        const statusesResult = await dataSource.query(statusesQuery);
        
        console.log(`\n📊 Estados disponibles:`);
        statusesResult.forEach(status => {
          console.log(`   ${status.id}. ${status.descripcion} (${status.nombre})`);
        });
      } else {
        console.log(`   ❌ Tabla solicitud_desembolso_web_status NO existe`);
      }
    } catch (error) {
      console.log(`   ❌ Error accediendo a solicitud_desembolso_web_status: ${error.message}`);
    }

    // Verificar estados en la tabla de solicitudes
    console.log(`\n📋 Verificando estados en solicitud_desembolso_web:`);
    try {
      const requestStatusesQuery = `
        SELECT DISTINCT 
          solicitud_status,
          COUNT(*) as cantidad
        FROM solicitud_desembolso_web 
        GROUP BY solicitud_status
        ORDER BY solicitud_status
      `;
      const requestStatusesResult = await dataSource.query(requestStatusesQuery);
      
      console.log(`   Estados encontrados en solicitudes:`);
      requestStatusesResult.forEach(status => {
        console.log(`   ${status.solicitud_status}: ${status.cantidad} solicitudes`);
      });
    } catch (error) {
      console.log(`   ❌ Error consultando estados: ${error.message}`);
    }

    // Verificar estados en la vista
    console.log(`\n📋 Verificando estados en vsolicitud_desembolso_web:`);
    try {
      const viewStatusesQuery = `
        SELECT DISTINCT 
          solicitud_status,
          estatus_desc,
          COUNT(*) as cantidad
        FROM vsolicitud_desembolso_web 
        GROUP BY solicitud_status, estatus_desc
        ORDER BY solicitud_status
      `;
      const viewStatusesResult = await dataSource.query(viewStatusesQuery);
      
      console.log(`   Estados encontrados en la vista:`);
      viewStatusesResult.forEach(status => {
        console.log(`   ${status.solicitud_status}: ${status.estatus_desc} (${status.cantidad} solicitudes)`);
      });
    } catch (error) {
      console.log(`   ❌ Error consultando vista: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await app.close();
  }
}

checkRequestStatuses().catch(console.error);
