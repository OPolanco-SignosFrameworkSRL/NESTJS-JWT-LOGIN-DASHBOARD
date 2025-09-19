import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkViewDefinition() {
  console.log('🔍 Verificando definición de la vista vsolicitud_generales...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Obtener la definición de la vista
    const viewDefinition = await dataSource.query(`
      SELECT VIEW_DEFINITION 
      FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_NAME = 'vsolicitud_generales'
    `);
    
    if (viewDefinition.length === 0) {
      console.log('❌ No se encontró la vista vsolicitud_generales');
      return;
    }
    
    console.log('📋 Definición de la vista vsolicitud_generales:');
    console.log(viewDefinition[0].VIEW_DEFINITION);
    
    // Verificar si hay algún filtro específico que excluya la solicitud 32790
    console.log('\n🔍 Verificando por qué la solicitud 32790 no aparece en la vista...');
    
    // Verificar si el problema está en el tipo de solicitud
    const request32790 = await dataSource.query(`
      SELECT * FROM solicitud_desembolso_web WHERE id = 32790
    `);
    
    if (request32790.length > 0) {
      const request = request32790[0];
      console.log('📊 Datos de la solicitud 32790 en la tabla base:');
      console.log(`  - ID: ${request.id}`);
      console.log(`  - Tipo de solicitud: ${request.solicitud_tipo}`);
      console.log(`  - Status: ${request.solicitud_status}`);
      console.log(`  - Usuario solicitante: ${request.solicitada_porid}`);
      console.log(`  - División: ${request.divicionid}`);
      console.log(`  - Concepto: ${request.concepto}`);
      console.log(`  - Producción: ${request.produccion}`);
      
      // Verificar si existe en la vista intermedia
      const intermediateRequest = await dataSource.query(`
        SELECT * FROM vsolicitud_desembolso_web WHERE id = 32790
      `);
      
      if (intermediateRequest.length > 0) {
        console.log('✅ Solicitud 32790 SÍ aparece en vsolicitud_desembolso_web:');
        console.log(JSON.stringify(intermediateRequest[0], null, 2));
      } else {
        console.log('❌ Solicitud 32790 NO aparece en vsolicitud_desembolso_web');
      }
      
      // Verificar si hay otros registros con el mismo tipo de solicitud en la vista
      const similarRequests = await dataSource.query(`
        SELECT TOP 5 id, solicitud_tipo, solicitud_tipo_desc, solicitud_status, solicitada_porid, divicionid
        FROM vsolicitud_generales 
        WHERE solicitud_tipo = ${request.solicitud_tipo}
        ORDER BY id DESC
      `);
      
      console.log(`\n📊 Solicitudes con tipo ${request.solicitud_tipo} en la vista:`);
      similarRequests.forEach((req, index) => {
        console.log(`${index + 1}. ID ${req.id}: ${req.solicitud_tipo_desc} (status: ${req.solicitud_status}, usuario: ${req.solicitada_porid})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkViewDefinition(); 