import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UpdateRequestStatusUseCase } from '../core/application/use-cases/update-request-status.use-case';

async function testAdminRequestManagement() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando Gestión de Solicitudes por Administradores\n');

    // Obtener el caso de uso
    const updateRequestStatusUseCase = app.get(UpdateRequestStatusUseCase);
    
    // Simular un usuario administrador (ID = 1)
    const adminUserId = 1;
    
    // Probar con la solicitud ID = 5 (que ya existe y está pendiente)
    const requestId = 5;
    console.log(`📋 Probando gestión de solicitud ID = ${requestId}...`);
    
    // 1. Probar APROBAR la solicitud
    console.log(`\n📋 1. Probando APROBAR solicitud...`);
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
      
    } catch (error) {
      console.log(`   ❌ Error aprobando solicitud: ${error.message}`);
    }

    // 2. Probar AUTORIZAR la solicitud (después de aprobarla)
    console.log(`\n📋 2. Probando AUTORIZAR solicitud...`);
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

    // 3. Probar RECHAZAR la solicitud (debería fallar porque ya está autorizada)
    console.log(`\n📋 3. Probando RECHAZAR solicitud (debería fallar)...`);
    try {
      const rejectResult = await updateRequestStatusUseCase.execute({
        requestId,
        action: 'reject' as any,
        comment: 'Solicitud rechazada',
        adminUserId,
      });
      
      console.log(`   ✅ Solicitud rechazada exitosamente:`);
      console.log(`      Nuevo estado: ${rejectResult.newStatus} (${rejectResult.newStatusText})`);
      console.log(`      Acción: ${rejectResult.action}`);
      console.log(`      Admin ID: ${rejectResult.adminUserId}`);
      console.log(`      Mensaje: ${rejectResult.message}`);
      
    } catch (error) {
      console.log(`   ❌ Error rechazando solicitud (esperado): ${error.message}`);
    }

    // 4. Probar con una solicitud que no existe
    console.log(`\n📋 4. Probando con solicitud inexistente (ID = 999)...`);
    try {
      const invalidResult = await updateRequestStatusUseCase.execute({
        requestId: 999,
        action: 'approve' as any,
        adminUserId,
      });
      
      console.log(`   ✅ Solicitud aprobada exitosamente (no debería llegar aquí)`);
      
    } catch (error) {
      console.log(`   ❌ Error esperado con solicitud inexistente: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

testAdminRequestManagement().catch(console.error);
