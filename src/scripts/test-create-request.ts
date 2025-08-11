import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CashRequestService } from '../core/domain/services/cash-request.service';

async function testCreateRequest() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando Creación de Solicitud\n');

    // Obtener el servicio usando el token correcto
    const cashRequestService = app.get('ICashRequestService');
    
    // Simular un usuario
    const currentUser = {
      sub: 30, // Usuario que ya existe
      role: 'User' as any
    };
    
    // Datos de la solicitud (según los campos requeridos del usuario)
    const requestData = {
      monto_solicitado: 3500,
      solicitud_tipo: 3,
      divicionid: 1,
      tipo_pago: 1,
      concepto: 'Materiales para mantenimiento de equipos',
      fecha_requerida: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      departamento: 'Administración',
      nombre_cliente: 'Cliente ABC',
      num_orden_prod: 'OP-001',
      num_ticket_prod: 'TK-001',
    };
    
    console.log(`📋 Datos de la solicitud:`);
    console.log(`   Monto: ${requestData.monto_solicitado}`);
    console.log(`   Concepto: ${requestData.concepto}`);
    console.log(`   División: ${requestData.divicionid}`);
    console.log(`   Tipo de pago: ${requestData.tipo_pago}`);
    console.log(`   Fecha requerida: ${requestData.fecha_requerida}`);
    
    console.log(`\n📋 Creando solicitud...`);
    
    try {
      const result = await cashRequestService.create(requestData, currentUser);
      
      console.log(`✅ Solicitud creada exitosamente:`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Estado: ${result.solicitud_status}`);
      console.log(`   Usuario: ${result.usuarionombre}`);
      console.log(`   Monto: ${result.monto_solicitado}`);
      console.log(`   Concepto: ${result.concepto}`);
      console.log(`   Fecha creada: ${result.fechacreada}`);
      
    } catch (error) {
      console.log(`❌ Error creando solicitud: ${error.message}`);
      if (error.stack) {
        console.log(`   Stack: ${error.stack}`);
      }
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

testCreateRequest().catch(console.error); 