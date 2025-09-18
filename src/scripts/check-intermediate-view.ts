import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkIntermediateView() {
  console.log('🔍 Verificando vista intermedia vsolicitud_desembolso_web...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Obtener la definición de la vista intermedia
    const viewDefinition = await dataSource.query(`
      SELECT VIEW_DEFINITION 
      FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_NAME = 'vsolicitud_desembolso_web'
    `);
    
    if (viewDefinition.length === 0) {
      console.log('❌ No se encontró la vista vsolicitud_desembolso_web');
      return;
    }
    
    console.log('📋 Definición de la vista vsolicitud_desembolso_web:');
    console.log(viewDefinition[0].VIEW_DEFINITION);
    
    // Verificar algunos registros de la vista intermedia
    const records = await dataSource.query(`
      SELECT TOP 3 id, produccion, solicitud_status FROM vsolicitud_desembolso_web ORDER BY id DESC
    `);
    
    console.log('📊 Registros de ejemplo de vsolicitud_desembolso_web:');
    console.log(JSON.stringify(records, null, 2));
    
    // Verificar si las solicitudes que creamos aparecen en la vista intermedia
    const ourRequests = await dataSource.query(`
      SELECT id, produccion, solicitud_status FROM vsolicitud_desembolso_web 
      WHERE solicitada_porid = 62233 
      ORDER BY id DESC
    `);
    
    console.log('📊 Nuestras solicitudes en vsolicitud_desembolso_web:');
    console.log(JSON.stringify(ourRequests, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkIntermediateView(); 