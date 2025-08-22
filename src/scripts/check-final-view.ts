import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkFinalView() {
  console.log('🔍 Verificando vista final vsolicitud_generales...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar si la solicitud 32789 aparece en la vista final
    const ourRequest = await dataSource.query(`
      SELECT * FROM vsolicitud_generales WHERE id = 32789
    `);
    
    if (ourRequest.length > 0) {
      console.log('✅ Solicitud 32789 SÍ aparece en vsolicitud_generales:');
      console.log(JSON.stringify(ourRequest[0], null, 2));
    } else {
      console.log('❌ Solicitud 32789 NO aparece en vsolicitud_generales');
    }
    
    // Verificar todas nuestras solicitudes en la vista final
    const ourRequests = await dataSource.query(`
      SELECT id, solicitud_tipo, solicitud_tipo_desc, produccion, solicitud_status, monto_solicitado, concepto 
      FROM vsolicitud_generales 
      WHERE solicitada_porid = 62233 
      ORDER BY id DESC
    `);
    
    console.log('\n📊 Todas nuestras solicitudes en vsolicitud_generales:');
    ourRequests.forEach((req, index) => {
      console.log(`${index + 1}. ID ${req.id}: ${req.solicitud_tipo_desc} (tipo: ${req.solicitud_tipo}, produccion: ${req.produccion}, status: ${req.solicitud_status})`);
      console.log(`   Monto: ${req.monto_solicitado}, Concepto: ${req.concepto}`);
    });
    
    // Verificar las últimas 5 solicitudes en la vista final
    const recentRequests = await dataSource.query(`
      SELECT TOP 5 id, solicitud_tipo, solicitud_tipo_desc, produccion, solicitud_status, monto_solicitado, concepto 
      FROM vsolicitud_generales 
      ORDER BY id DESC
    `);
    
    console.log('\n📊 Últimas 5 solicitudes en vsolicitud_generales:');
    recentRequests.forEach((req, index) => {
      console.log(`${index + 1}. ID ${req.id}: ${req.solicitud_tipo_desc} (tipo: ${req.solicitud_tipo}, produccion: ${req.produccion}, status: ${req.solicitud_status})`);
      console.log(`   Monto: ${req.monto_solicitado}, Concepto: ${req.concepto}`);
    });
    
    // Contar total de solicitudes en la vista
    const totalCount = await dataSource.query(`
      SELECT COUNT(*) as total FROM vsolicitud_generales
    `);
    
    console.log(`\n📈 Total de solicitudes en vsolicitud_generales: ${totalCount[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkFinalView(); 