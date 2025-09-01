import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkRequestAfterUpdate() {
  console.log('🔍 Verificando estado de la solicitud 32790 después de actualización...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar si la solicitud 32790 existe en la tabla base
    const baseRequest = await dataSource.query(`
      SELECT * FROM solicitud_desembolso_web WHERE id = 32790
    `);
    
    if (baseRequest.length > 0) {
      console.log('✅ Solicitud 32790 SÍ existe en la tabla base:');
      console.log(`  - ID: ${baseRequest[0].id}`);
      console.log(`  - Concepto: ${baseRequest[0].concepto}`);
      console.log(`  - Monto: ${baseRequest[0].monto_solicitado}`);
      console.log(`  - Status: ${baseRequest[0].solicitud_status}`);
      console.log(`  - Producción: ${baseRequest[0].produccion}`);
      console.log(`  - Tipo: ${baseRequest[0].solicitud_tipo}`);
    } else {
      console.log('❌ Solicitud 32790 NO existe en la tabla base');
    }
    
    // Verificar si existe en la vista intermedia
    const intermediateRequest = await dataSource.query(`
      SELECT * FROM vsolicitud_desembolso_web WHERE id = 32790
    `);
    
    if (intermediateRequest.length > 0) {
      console.log('✅ Solicitud 32790 SÍ existe en la vista intermedia:');
      console.log(`  - Producción: ${intermediateRequest[0].produccion}`);
      console.log(`  - Status: ${intermediateRequest[0].solicitud_status}`);
    } else {
      console.log('❌ Solicitud 32790 NO existe en la vista intermedia');
    }
    
    // Verificar si existe en la vista final
    const finalRequest = await dataSource.query(`
      SELECT * FROM vsolicitud_generales WHERE id = 32790
    `);
    
    if (finalRequest.length > 0) {
      console.log('✅ Solicitud 32790 SÍ existe en la vista final');
    } else {
      console.log('❌ Solicitud 32790 NO existe en la vista final');
      console.log('   Esto es NORMAL porque la vista tiene el filtro: produccion != 1 and solicitud_status <= 6');
      console.log('   La solicitud 32790 tiene produccion = 1, por lo que es excluida por el filtro.');
    }
    
    // Mostrar el filtro de la vista final
    console.log('\n📋 Filtro de la vista vsolicitud_generales:');
    console.log('   WHERE produccion != 1 and solicitud_status <= 6');
    console.log('   Esto significa que solo muestra solicitudes con:');
    console.log('   - produccion != 1 (no es de producción)');
    console.log('   - solicitud_status <= 6 (estado válido)');
    
    // Verificar cuántas solicitudes tienen produccion = 1
    const productionRequests = await dataSource.query(`
      SELECT COUNT(*) as count FROM solicitud_desembolso_web WHERE produccion = 1
    `);
    
    console.log(`\n📊 Total de solicitudes con produccion = 1: ${productionRequests[0].count}`);
    
    // Verificar cuántas solicitudes aparecen en la vista final
    const viewRequests = await dataSource.query(`
      SELECT COUNT(*) as count FROM vsolicitud_generales
    `);
    
    console.log(`📊 Total de solicitudes en la vista final: ${viewRequests[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkRequestAfterUpdate(); 