import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkViewContent() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Verificando Contenido de la Vista vsolicitud_desembolso_web\n');

    // Verificar qué contiene la vista
    console.log(`📋 Contenido de vsolicitud_desembolso_web:`);
    const viewQuery = `
      SELECT TOP 10
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM vsolicitud_desembolso_web 
      ORDER BY id DESC
    `;
    
    const viewResult = await dataSource.query(viewQuery);
    
    if (viewResult.length > 0) {
      console.log(`   Total encontradas en vista: ${viewResult.length}`);
      viewResult.forEach((request, index) => {
        console.log(`   ${index + 1}. ID: ${request.id}, Creada por: ${request.solicitada_porid}, Estado: ${request.solicitud_status}, Monto: ${request.monto_solicitado}`);
      });
    } else {
      console.log(`   No se encontraron solicitudes en la vista`);
    }

    console.log('');

    // Verificar qué contiene la tabla real
    console.log(`📋 Contenido de solicitud_desembolso_web (tabla real):`);
    const tableQuery = `
      SELECT TOP 10
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM solicitud_desembolso_web 
      ORDER BY id DESC
    `;
    
    const tableResult = await dataSource.query(tableQuery);
    
    if (tableResult.length > 0) {
      console.log(`   Total encontradas en tabla: ${tableResult.length}`);
      tableResult.forEach((request, index) => {
        console.log(`   ${index + 1}. ID: ${request.id}, Creada por: ${request.solicitada_porid}, Estado: ${request.solicitud_status}, Monto: ${request.monto_solicitado}`);
      });
    } else {
      console.log(`   No se encontraron solicitudes en la tabla`);
    }

    console.log('');

    // Verificar la solicitud específica en ambas
    console.log(`🔍 Verificando solicitud ID = 5:`);
    
    // En la vista
    const viewSpecificQuery = `
      SELECT 
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM vsolicitud_desembolso_web 
      WHERE id = 5
    `;
    
    const viewSpecificResult = await dataSource.query(viewSpecificQuery);
    
    if (viewSpecificResult.length > 0) {
      console.log(`   ✅ Encontrada en vista vsolicitud_desembolso_web:`);
      const request = viewSpecificResult[0];
      console.log(`      ID: ${request.id}`);
      console.log(`      Creada por: ${request.solicitada_porid}`);
      console.log(`      Estado: ${request.solicitud_status}`);
      console.log(`      Monto: ${request.monto_solicitado}`);
    } else {
      console.log(`   ❌ NO encontrada en vista vsolicitud_desembolso_web`);
    }

    // En la tabla
    const tableSpecificQuery = `
      SELECT 
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM solicitud_desembolso_web 
      WHERE id = 5
    `;
    
    const tableSpecificResult = await dataSource.query(tableSpecificQuery);
    
    if (tableSpecificResult.length > 0) {
      console.log(`   ✅ Encontrada en tabla solicitud_desembolso_web:`);
      const request = tableSpecificResult[0];
      console.log(`      ID: ${request.id}`);
      console.log(`      Creada por: ${request.solicitada_porid}`);
      console.log(`      Estado: ${request.solicitud_status}`);
      console.log(`      Monto: ${request.monto_solicitado}`);
    } else {
      console.log(`   ❌ NO encontrada en tabla solicitud_desembolso_web`);
    }

    // Análisis
    console.log(`\n🔍 Análisis:`);
    if (viewSpecificResult.length === 0 && tableSpecificResult.length > 0) {
      console.log(`   ⚠️ La solicitud existe en la tabla pero NO en la vista`);
      console.log(`   💡 Hay un problema con la vista vsolicitud_desembolso_web`);
      console.log(`   💡 La vista no está sincronizada con la tabla real`);
    } else if (viewSpecificResult.length > 0 && tableSpecificResult.length > 0) {
      console.log(`   ✅ La solicitud existe tanto en la tabla como en la vista`);
      console.log(`   💡 El problema debe estar en otro lugar del código`);
    } else if (viewSpecificResult.length === 0 && tableSpecificResult.length === 0) {
      console.log(`   ❌ La solicitud NO existe en ninguna de las dos`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la verificación
checkViewContent().catch(console.error);
