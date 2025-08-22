import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkSpecificRequest() {
  console.log('🔍 Verificando solicitud específica 32790...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar si la solicitud 32790 existe en la vista
    const request32790 = await dataSource.query(`
      SELECT * FROM vsolicitud_generales WHERE id = 32790
    `);
    
    if (request32790.length > 0) {
      console.log('✅ Solicitud 32790 SÍ aparece en vsolicitud_generales:');
      console.log(JSON.stringify(request32790[0], null, 2));
    } else {
      console.log('❌ Solicitud 32790 NO aparece en vsolicitud_generales');
    }
    
    // Verificar si existe en la tabla base
    const baseRequest32790 = await dataSource.query(`
      SELECT * FROM solicitud_desembolso_web WHERE id = 32790
    `);
    
    if (baseRequest32790.length > 0) {
      console.log('✅ Solicitud 32790 SÍ aparece en solicitud_desembolso_web:');
      console.log(JSON.stringify(baseRequest32790[0], null, 2));
    } else {
      console.log('❌ Solicitud 32790 NO aparece en solicitud_desembolso_web');
    }
    
    // Verificar las últimas 10 solicitudes para ver el rango de IDs
    const recentRequests = await dataSource.query(`
      SELECT TOP 10 id, solicitud_tipo, solicitud_tipo_desc, solicitud_status, monto_solicitado, concepto 
      FROM vsolicitud_generales 
      ORDER BY id DESC
    `);
    
    console.log('\n📊 Últimas 10 solicitudes en vsolicitud_generales:');
    recentRequests.forEach((req, index) => {
      console.log(`${index + 1}. ID ${req.id}: ${req.solicitud_tipo_desc} (status: ${req.solicitud_status})`);
      console.log(`   Monto: ${req.monto_solicitado}, Concepto: ${req.concepto}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkSpecificRequest(); 