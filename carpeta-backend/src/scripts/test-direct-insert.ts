import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function testDirectInsert() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Probando Inserción Directa en Base de Datos\n');

    // Datos de la solicitud
    const requestData = {
      solicitada_porid: 30,
      solicitud_tipo: 1,
      solicitud_status: 1, // PENDIENTE
      monto_solicitado: 2500,
      concepto: 'Solicitud de prueba directa - materiales de oficina',
      divicionid: 1,
      tipo_pago: 1, // Efectivo
      fechacreada: new Date(),
      produccion: 0, // Para que aparezca en la vista
    };

    console.log(`📋 Datos de la solicitud:`);
    console.log(`   Usuario: ${requestData.solicitada_porid}`);
    console.log(`   Monto: ${requestData.monto_solicitado}`);
    console.log(`   Concepto: ${requestData.concepto}`);
    console.log(`   División: ${requestData.divicionid}`);
    console.log(`   Tipo de pago: ${requestData.tipo_pago}`);
    console.log(`   Fecha creada: ${requestData.fechacreada}`);

    console.log(`\n📋 Insertando directamente en la base de datos...`);

    try {
      // Insertar directamente en la tabla
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
        requestData.solicitada_porid,
        requestData.solicitud_tipo,
        requestData.solicitud_status,
        requestData.monto_solicitado,
        requestData.concepto,
        requestData.divicionid,
        requestData.tipo_pago,
        requestData.fechacreada,
        requestData.produccion,
      ]);

      console.log(`✅ Solicitud insertada exitosamente`);
      console.log(`   Resultado:`, insertResult);

      // Verificar que se insertó correctamente
      const verifyQuery = `
        SELECT TOP 1 
          id,
          solicitud_status,
          solicitada_porid,
          monto_solicitado,
          concepto,
          fechacreada
        FROM solicitud_desembolso_web 
        WHERE solicitada_porid = ? 
          AND monto_solicitado = ? 
          AND concepto = ?
        ORDER BY id DESC
      `;

      const verifyResult = await dataSource.query(verifyQuery, [
        requestData.solicitada_porid,
        requestData.monto_solicitado,
        requestData.concepto,
      ]);

      if (verifyResult.length > 0) {
        const request = verifyResult[0];
        console.log(`\n📋 Solicitud verificada:`);
        console.log(`   ID: ${request.id}`);
        console.log(`   Estado: ${request.solicitud_status}`);
        console.log(`   Creada por: ${request.solicitada_porid}`);
        console.log(`   Monto: ${request.monto_solicitado}`);
        console.log(`   Concepto: ${request.concepto}`);
        console.log(`   Fecha: ${request.fechacreada}`);
      }

    } catch (error) {
      console.log(`❌ Error insertando directamente: ${error.message}`);
      if (error.stack) {
        console.log(`   Stack: ${error.stack}`);
      }
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

testDirectInsert().catch(console.error);
