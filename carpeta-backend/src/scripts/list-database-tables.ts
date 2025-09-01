import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function listDatabaseTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Listando Tablas y Vistas de la Base de Datos\n');

    // Listar todas las tablas
    console.log(`📋 Tablas disponibles:`);
    const tablesQuery = `
      SELECT TABLE_NAME, TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `;
    
    const tablesResult = await dataSource.query(tablesQuery);
    
    if (tablesResult.length > 0) {
      tablesResult.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.TABLE_NAME} (${table.TABLE_TYPE})`);
      });
    } else {
      console.log(`   No se encontraron tablas`);
    }

    console.log('');

    // Listar todas las vistas
    console.log(`📋 Vistas disponibles:`);
    const viewsQuery = `
      SELECT TABLE_NAME, TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'VIEW'
      ORDER BY TABLE_NAME
    `;
    
    const viewsResult = await dataSource.query(viewsQuery);
    
    if (viewsResult.length > 0) {
      viewsResult.forEach((view, index) => {
        console.log(`   ${index + 1}. ${view.TABLE_NAME} (${view.TABLE_TYPE})`);
      });
    } else {
      console.log(`   No se encontraron vistas`);
    }

    console.log('');

    // Buscar tablas relacionadas con solicitudes
    console.log(`🔍 Buscando tablas relacionadas con solicitudes:`);
    const searchQuery = `
      SELECT TABLE_NAME, TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME LIKE '%solicitud%' 
         OR TABLE_NAME LIKE '%request%'
         OR TABLE_NAME LIKE '%cash%'
         OR TABLE_NAME LIKE '%app%'
      ORDER BY TABLE_NAME
    `;
    
    const searchResult = await dataSource.query(searchQuery);
    
    if (searchResult.length > 0) {
      searchResult.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.TABLE_NAME} (${item.TABLE_TYPE})`);
      });
    } else {
      console.log(`   No se encontraron tablas relacionadas`);
    }

    console.log('');

    // Verificar si existe la tabla appcashrequests
    console.log(`🔍 Verificando tabla appcashrequests:`);
    try {
      const checkTableQuery = `
        SELECT TOP 1 * FROM appcashrequests
      `;
      const checkResult = await dataSource.query(checkTableQuery);
      console.log(`   ✅ Tabla appcashrequests existe y es accesible`);
      console.log(`   📊 Número de registros: ${checkResult.length}`);
    } catch (error) {
      console.log(`   ❌ Error accediendo a appcashrequests: ${error.message}`);
    }

    // Verificar si existe la tabla comentarios
    console.log(`\n🔍 Verificando tabla comentarios:`);
    try {
      const checkCommentsQuery = `
        SELECT TOP 1 * FROM comentarios
      `;
      const checkCommentsResult = await dataSource.query(checkCommentsQuery);
      console.log(`   ✅ Tabla comentarios existe y es accesible`);
      console.log(`   📊 Número de registros: ${checkCommentsResult.length}`);
    } catch (error) {
      console.log(`   ❌ Error accediendo a comentarios: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la verificación
listDatabaseTables().catch(console.error);
