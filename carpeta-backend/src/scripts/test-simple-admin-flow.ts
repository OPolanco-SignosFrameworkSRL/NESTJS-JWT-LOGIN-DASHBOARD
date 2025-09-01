import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UpdateRequestStatusUseCase } from '../core/application/use-cases/update-request-status.use-case';

async function testSimpleAdminFlow() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando Flujo Simple de Administración de Solicitudes\n');

    // Obtener el caso de uso
    const updateRequestStatusUseCase = app.get(UpdateRequestStatusUseCase);
    
    // Simular un usuario administrador (ID = 1)
    const adminUserId = 1;
    
    // Buscar una solicitud pendiente para probar
    console.log(`📋 Buscando solicitudes pendientes para probar...`);
    
    // Por ahora, vamos a probar con la solicitud ID = 5 que sabemos que existe
    // pero necesitamos verificar su estado actual
    const requestId = 5;
    
    // 1. Probar APROBAR la solicitud (solo si está pendiente)
    console.log(`\n📋 1. Probando APROBAR solicitud ID = ${requestId}...`);
    try {
      const approveResult = await updateRequestStatusUseCase.execute({
        requestId,
        action: 'approve' as any,
        comment: 'Documentación completa, solicitud aprobada',
        adminUserId,
      });
      
      console.log(`   ✅ Solicitud aprobada exitosamente:`);
      console.log(`      Nuevo estado: ${approveResult.newStatus} (${approveResult.newStatusText})`);
      console.log(`      Acción: ${approveResult.action}`);
      console.log(`      Admin ID: ${approveResult.adminUserId}`);
      console.log(`      Mensaje: ${approveResult.message}`);
      
      // 2. Si se aprobó exitosamente, probar AUTORIZAR
      console.log(`\n📋 2. Probando AUTORIZAR solicitud ID = ${requestId}...`);
      try {
        const authorizeResult = await updateRequestStatusUseCase.execute({
          requestId,
          action: 'authorize' as any,
          comment: 'Solicitud autorizada para desembolso',
          adminUserId,
        });
        
        console.log(`   ✅ Solicitud autorizada exitosamente:`);
        console.log(`      Nuevo estado: ${authorizeResult.newStatus} (${authorizeResult.newStatusText})`);
        console.log(`      Acción: ${authorizeResult.action}`);
        console.log(`      Admin ID: ${authorizeResult.adminUserId}`);
        console.log(`      Mensaje: ${authorizeResult.message}`);
        
      } catch (error) {
        console.log(`   ❌ Error autorizando solicitud: ${error.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error aprobando solicitud: ${error.message}`);
      
      // Si no se puede aprobar, probar RECHAZAR
      console.log(`\n📋 1b. Probando RECHAZAR solicitud ID = ${requestId}...`);
      try {
        const rejectResult = await updateRequestStatusUseCase.execute({
          requestId,
          action: 'reject' as any,
          comment: 'Solicitud rechazada por administrador',
          adminUserId,
        });
        
        console.log(`   ✅ Solicitud rechazada exitosamente:`);
        console.log(`      Nuevo estado: ${rejectResult.newStatus} (${rejectResult.newStatusText})`);
        console.log(`      Acción: ${rejectResult.action}`);
        console.log(`      Admin ID: ${rejectResult.adminUserId}`);
        console.log(`      Mensaje: ${rejectResult.message}`);
        
      } catch (error) {
        console.log(`   ❌ Error rechazando solicitud: ${error.message}`);
      }
    }

    console.log(`\n💡 Resumen del flujo de administración:`);
    console.log(`   - Solo los administradores pueden cambiar estados`);
    console.log(`   - Flujo: PENDIENTE (1) → APROBADA (2) → AUTORIZADO (3)`);
    console.log(`   - Se puede RECHAZAR (4) en cualquier momento`);
    console.log(`   - Cada acción actualiza campos específicos en la base de datos`);

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

testSimpleAdminFlow().catch(console.error);
