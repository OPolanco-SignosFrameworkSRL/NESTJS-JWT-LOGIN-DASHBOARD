import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function createTestRequest() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Creando Solicitud de Prueba\n');

    // Crear una nueva solicitud de prueba
    const testRequestData = {
      solicitada_porid: 30, // Usuario que ya existe
      solicitud_tipo: 1,    // Tipo de solicitud válido
      solicitud_status: 1,  // PENDIENTE
      monto_solicitado: 5000,
      concepto: 'Solicitud de prueba para demostrar funcionalidad de admin',
      divicionid: 1,        // División válida
      tipo_pago: 1,         // Efectivo
      fechacreada: new Date(),
      produccion: 0,        // Para que aparezca en la vista
    };

    console.log(`📋 Datos de la solicitud de prueba:`);
    console.log(`   Usuario solicitante: ${testRequestData.solicitada_porid}`);
    console.log(`   Tipo: ${testRequestData.solicitud_tipo}`);
    console.log(`   Estado: ${testRequestData.solicitud_status} (PENDIENTE)`);
    console.log(`   Monto: ${testRequestData.monto_solicitado}`);
    console.log(`   Concepto: ${testRequestData.concepto}`);

    // Insertar la solicitud
    const insertQuery = `
      INSERT INTO solicitud_desembolso_web (
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        divicionid,
        tipo_pago,
        fechacreada,
        produccion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertResult = await dataSource.query(insertQuery, [
      testRequestData.solicitada_porid,
      testRequestData.solicitud_tipo,
      testRequestData.solicitud_status,
      testRequestData.monto_solicitado,
      testRequestData.concepto,
      testRequestData.divicionid,
      testRequestData.tipo_pago,
      testRequestData.fechacreada,
      testRequestData.produccion,
    ]);

    console.log(`\n✅ Solicitud creada exitosamente`);
    console.log(`   ID asignado: ${insertResult.insertId || 'N/A'}`);

    // Verificar que se creó correctamente
    const verifyQuery = `
      SELECT 
        id,
        solicitud_status,
        solicitada_porid,
        monto_solicitado,
        concepto,
        fechacreada
      FROM solicitud_desembolso_web 
      WHERE id = ${insertResult.insertId || 'LAST_INSERT_ID()'}
    `;

    const verifyResult = await dataSource.query(verifyQuery);
    
    if (verifyResult.length > 0) {
      const request = verifyResult[0];
      console.log(`\n📋 Solicitud verificada:`);
      console.log(`   ID: ${request.id}`);
      console.log(`   Estado: ${request.solicitud_status} (PENDIENTE)`);
      console.log(`   Creada por: ${request.solicitada_porid}`);
      console.log(`   Monto: ${request.monto_solicitado}`);
      console.log(`   Concepto: ${request.concepto}`);
      console.log(`   Fecha: ${request.fechacreada}`);
      
      console.log(`\n💡 Ahora puedes usar esta solicitud ID = ${request.id} para probar:`);
      console.log(`   - Aprobar (estado 1 → 2)`);
      console.log(`   - Autorizar (estado 2 → 3)`);
      console.log(`   - Rechazar (estado 1 → 4)`);
    }

  } catch (error) {
    console.error('❌ Error creando solicitud de prueba:', error);
  } finally {
    await app.close();
  }
}

createTestRequest().catch(console.error);
