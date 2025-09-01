import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkCurrentRequestStatus() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Verificando Estado Actual de la Solicitud ID = 5\n');

    // Verificar en la tabla base
    console.log(`📋 Verificando en tabla solicitud_desembolso_web:`);
    try {
      const baseRequestQuery = `
        SELECT 
          id,
          solicitud_status,
          estatus_desc,
          solicitada_porid,
          monto_solicitado,
          concepto,
          fechacreada,
          fecha_aprobada,
          fecha_rechazada,
          autorizado_porid,
          verificada_porid,
          razon_rechazon
        FROM solicitud_desembolso_web 
        WHERE id = 5
      `;
      const baseRequestResult = await dataSource.query(baseRequestQuery);
      
      if (baseRequestResult.length > 0) {
        const request = baseRequestResult[0];
        console.log(`   ✅ Solicitud encontrada:`);
        console.log(`      ID: ${request.id}`);
        console.log(`      Estado: ${request.solicitud_status} (${request.estatus_desc})`);
        console.log(`      Creada por: ${request.solicitada_porid}`);
        console.log(`      Monto: ${request.monto_solicitado}`);
        console.log(`      Concepto: ${request.concepto}`);
        console.log(`      Fecha creada: ${request.fechacreada}`);
        console.log(`      Fecha aprobada: ${request.fecha_aprobada || 'No aprobada'}`);
        console.log(`      Fecha rechazada: ${request.fecha_rechazada || 'No rechazada'}`);
        console.log(`      Autorizado por: ${request.autorizado_porid || 'No autorizado'}`);
        console.log(`      Verificado por: ${request.verificada_porid || 'No verificado'}`);
        console.log(`      Razón rechazo: ${request.razon_rechazon || 'No rechazada'}`);
      } else {
        console.log(`   ❌ Solicitud ID = 5 NO encontrada en la tabla base`);
      }
    } catch (error) {
      console.log(`   ❌ Error consultando tabla base: ${error.message}`);
    }

    // Verificar en la vista
    console.log(`\n📋 Verificando en vista vsolicitud_desembolso_web:`);
    try {
      const viewRequestQuery = `
        SELECT 
          id,
          solicitud_status,
          estatus_desc,
          solicitada_porid,
          monto_solicitado,
          concepto,
          fechacreada
        FROM vsolicitud_desembolso_web 
        WHERE id = 5
      `;
      const viewRequestResult = await dataSource.query(viewRequestQuery);
      
      if (viewRequestResult.length > 0) {
        const request = viewRequestResult[0];
        console.log(`   ✅ Solicitud encontrada en vista:`);
        console.log(`      ID: ${request.id}`);
        console.log(`      Estado: ${request.solicitud_status} (${request.estatus_desc})`);
        console.log(`      Creada por: ${request.solicitada_porid}`);
        console.log(`      Monto: ${request.monto_solicitado}`);
        console.log(`      Concepto: ${request.concepto}`);
        console.log(`      Fecha creada: ${request.fechacreada}`);
      } else {
        console.log(`   ❌ Solicitud ID = 5 NO encontrada en la vista`);
      }
    } catch (error) {
      console.log(`   ❌ Error consultando vista: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await app.close();
  }
}

checkCurrentRequestStatus().catch(console.error);
