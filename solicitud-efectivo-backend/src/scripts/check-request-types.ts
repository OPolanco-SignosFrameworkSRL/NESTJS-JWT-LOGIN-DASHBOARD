import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function checkRequestTypes() {
  console.log('🔍 Verificando tipos de solicitud...');
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar todos los tipos de solicitud
    const requestTypes = await dataSource.query(`
      SELECT id, tipo_desc, produccion_flag FROM solicitud_desembolso_web_tipos ORDER BY id
    `);
    
    console.log('📋 Tipos de solicitud disponibles:');
    requestTypes.forEach(type => {
      console.log(`  - ID ${type.id}: ${type.tipo_desc} (produccion: ${type.produccion_flag})`);
    });
    
    // Verificar cuáles tienen produccion_flag = 0
    const nonProductionTypes = requestTypes.filter(type => type.produccion_flag === false);
    console.log('\n✅ Tipos que aparecerán en la vista (produccion = 0):');
    nonProductionTypes.forEach(type => {
      console.log(`  - ID ${type.id}: ${type.tipo_desc}`);
    });
    
    // Verificar cuáles tienen produccion_flag = 1
    const productionTypes = requestTypes.filter(type => type.produccion_flag === true);
    console.log('\n❌ Tipos que NO aparecerán en la vista (produccion = 1):');
    productionTypes.forEach(type => {
      console.log(`  - ID ${type.id}: ${type.tipo_desc}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkRequestTypes(); 