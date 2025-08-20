import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ICashRequestRepository } from '../core/domain/repositories/cash-request.repository.interface';
import { CASH_REQUEST_REPOSITORY } from '../core/application/tokens';

async function testRepositoryFindById() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando CashRequestRepository.findById()\n');

    // Obtener el repositorio
    const cashRequestRepository = app.get<ICashRequestRepository>(CASH_REQUEST_REPOSITORY);
    
    // Probar con la solicitud ID = 5
    const requestId = 5;
    console.log(`📋 Probando findById(${requestId})...`);
    
    const result = await cashRequestRepository.findById(requestId);
    
    if (result) {
      console.log(`   ✅ Solicitud encontrada:`);
      console.log(`      ID: ${result.id}`);
      console.log(`      Solicitada por ID: ${result.solicitada_porid}`);
      console.log(`      Estado: ${result.solicitud_status}`);
      console.log(`      Tipo: ${result.solicitud_tipo}`);
      console.log(`      Monto: ${result.monto_solicitado}`);
      console.log(`      Concepto: ${result.concepto}`);
      console.log(`      Fecha: ${result.fechacreada}`);
      console.log(`      Tipo de solicitada_porid: ${typeof result.solicitada_porid}`);
      console.log(`      Tipo de ID: ${typeof result.id}`);
    } else {
      console.log(`   ❌ Solicitud NO encontrada (retornó null)`);
    }

    console.log('');

    // Probar con otras solicitudes para comparar
    console.log(`📋 Probando con otras solicitudes...`);
    const testIds = [3, 4, 5];
    
    for (const id of testIds) {
      const testResult = await cashRequestRepository.findById(id);
      if (testResult) {
        console.log(`   ID ${id}: ✅ Encontrada (creada por usuario ${testResult.solicitada_porid})`);
      } else {
        console.log(`   ID ${id}: ❌ NO encontrada`);
      }
    }

    console.log('');
    
    // Verificar si hay algún problema con el mapeo
    if (result) {
      console.log(`🔍 Verificando mapeo de datos:`);
      console.log(`   ¿solicitada_porid es number?: ${typeof result.solicitada_porid === 'number'}`);
      console.log(`   ¿id es number?: ${typeof result.id === 'number'}`);
      console.log(`   ¿solicitada_porid === 30?: ${result.solicitada_porid === 30}`);
      console.log(`   ¿result.solicitada_porid === 30?: ${result.solicitada_porid === 30}`);
      
      // Comparación estricta
      console.log(`   Comparación estricta: ${result.solicitada_porid === 30 ? '✅ SÍ' : '❌ NO'}`);
      console.log(`   Comparación con ==: ${result.solicitada_porid == 30 ? '✅ SÍ' : '❌ NO'}`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la prueba
testRepositoryFindById().catch(console.error);
