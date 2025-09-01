import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ICashRequestService } from '../core/domain/cash-request.service.interface';

async function testUpdateRequest() {
  console.log('🧪 Probando actualización de solicitud 32790...');
  
  const app = await NestFactory.create(AppModule);
  const cashRequestService = app.get<ICashRequestService>('ICashRequestService');
  
  try {
    console.log('✅ Servicio obtenido correctamente');
    
    // Simular usuario admin
    const currentUser = {
      sub: 62224,
      role: 'Admin' as any
    };
    
    // Datos de actualización
    const updateData = {
      monto_solicitado: 4000,
      solicitud_tipo: 1,
      divicionid: 1,
      tipo_pago: 1,
      concepto: "Materiales para mantenimiento de equipos - ACTUALIZADO",
      fecha_requerida: "2024-01-15T10:30:00.000Z"
    };
    
    console.log('📝 Intentando actualizar solicitud 32790...');
    const result = await cashRequestService.update(32790, updateData, currentUser);
    
    console.log('✅ Actualización exitosa:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error en la actualización:', error);
  } finally {
    await app.close();
  }
}

testUpdateRequest(); 