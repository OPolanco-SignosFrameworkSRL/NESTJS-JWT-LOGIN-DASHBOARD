import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkAvailableRequests() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Verificando Solicitudes Disponibles en la Base de Datos\n');

    // Verificar solicitudes en la vista
    console.log(`📋 Solicitudes en vsolicitud_generales:`);
    const viewQuery = `
      SELECT TOP 10
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM vsolicitud_generales 
      ORDER BY id DESC
    `;
    
    const viewResult = await dataSource.query(viewQuery);
    
    if (viewResult.length > 0) {
      console.log(`   Total encontradas: ${viewResult.length}`);
      viewResult.forEach((request, index) => {
        console.log(`   ${index + 1}. ID: ${request.id}, Creada por: ${request.solicitada_porid}, Estado: ${request.solicitud_status}, Monto: ${request.monto_solicitado}`);
      });
    } else {
      console.log(`   No se encontraron solicitudes en la vista`);
    }

    console.log('');

    // Verificar solicitudes en la tabla real
    console.log(`📋 Solicitudes en solicitud_desembolso_web:`);
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
      console.log(`   Total encontradas: ${tableResult.length}`);
      tableResult.forEach((request, index) => {
        console.log(`   ${index + 1}. ID: ${request.id}, Creada por: ${request.solicitada_porid}, Estado: ${request.solicitud_status}, Monto: ${request.monto_solicitado}`);
      });
    } else {
      console.log(`   No se encontraron solicitudes en la tabla`);
    }

    console.log('');

    // Verificar si existe la solicitud específica
    console.log(`🔍 Verificando solicitud específica ID = 5:`);
    const specificQuery = `
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
    
    const specificResult = await dataSource.query(specificQuery);
    
    if (specificResult.length > 0) {
      const request = specificResult[0];
      console.log(`   ✅ Solicitud encontrada:`);
      console.log(`      ID: ${request.id}`);
      console.log(`      Creada por: ${request.solicitada_porid}`);
      console.log(`      Estado: ${request.solicitud_status}`);
      console.log(`      Tipo: ${request.solicitud_tipo}`);
      console.log(`      Monto: ${request.monto_solicitado}`);
      console.log(`      Concepto: ${request.concepto}`);
      console.log(`      Fecha: ${request.fechacreada}`);
    } else {
      console.log(`   ❌ La solicitud con ID = 5 NO existe`);
    }

    console.log('');

    // Verificar si existe en la vista
    console.log(`🔍 Verificando en vista vsolicitud_generales ID = 5:`);
    const viewSpecificQuery = `
      SELECT 
        id,
        solicitada_porid,
        solicitud_tipo,
        solicitud_status,
        monto_solicitado,
        concepto,
        fechacreada
      FROM vsolicitud_generales 
      WHERE id = 5
    `;
    
    const viewSpecificResult = await dataSource.query(viewSpecificQuery);
    
    if (viewSpecificResult.length > 0) {
      const request = viewSpecificResult[0];
      console.log(`   ✅ Solicitud encontrada en vista:`);
      console.log(`      ID: ${request.id}`);
      console.log(`      Creada por: ${request.solicitada_porid}`);
      console.log(`      Estado: ${request.solicitud_status}`);
      console.log(`      Tipo: ${request.solicitud_tipo}`);
      console.log(`      Monto: ${request.monto_solicitado}`);
      console.log(`      Concepto: ${request.concepto}`);
      console.log(`      Fecha: ${request.fechacreada}`);
    } else {
      console.log(`   ❌ La solicitud con ID = 5 NO existe en la vista`);
    }

    // Análisis del problema
    console.log(`\n🔍 Análisis del problema:`);
    if (specificResult.length === 0 && viewSpecificResult.length === 0) {
      console.log(`   ❌ La solicitud con ID = 5 NO EXISTE en ninguna tabla`);
      console.log(`   💡 Esto explica por qué no se puede comentar en ella`);
      console.log(`   💡 El usuario debe crear comentarios en solicitudes que realmente existan`);
    } else if (specificResult.length > 0 && viewSpecificResult.length === 0) {
      console.log(`   ⚠️ La solicitud existe en la tabla pero NO en la vista`);
      console.log(`   💡 Hay un problema con la vista vsolicitud_generales`);
      console.log(`   💡 La vista no está sincronizada con la tabla real`);
    } else {
      console.log(`   ✅ La solicitud existe tanto en la tabla como en la vista`);
      console.log(`   💡 El problema debe estar en otro lugar del código`);
    }

    // Recomendaciones
    console.log(`\n💡 Recomendaciones:`);
    if (specificResult.length === 0) {
      console.log(`   1. Verificar si la solicitud ID = 5 fue eliminada o nunca existió`);
      console.log(`   2. Crear una nueva solicitud para probar los comentarios`);
      console.log(`   3. Verificar si hay algún problema con la secuencia de IDs`);
      console.log(`   4. Revisar si hay algún proceso de limpieza que eliminó la solicitud`);
    } else if (viewSpecificResult.length === 0) {
      console.log(`   1. Verificar la definición de la vista vsolicitud_generales`);
      console.log(`   2. Asegurar que la vista incluya todas las solicitudes`);
      console.log(`   3. Verificar si hay filtros en la vista que excluyan la solicitud`);
      console.log(`   4. Recrear la vista si es necesario`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la verificación
checkAvailableRequests().catch(console.error);
