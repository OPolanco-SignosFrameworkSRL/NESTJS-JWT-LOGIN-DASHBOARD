import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CommentService } from '../core/domain/services/comment.service';
import { ICashRequestRepository } from '../core/domain/repositories/cash-request.repository.interface';
import { CASH_REQUEST_REPOSITORY } from '../core/application/tokens';

async function testCommentCreationFlow() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando Flujo Completo de Creación de Comentarios\n');

    // Obtener el servicio y repositorio
    const commentService = app.get('CommentServiceInterface');
    const cashRequestRepository = app.get<ICashRequestRepository>(CASH_REQUEST_REPOSITORY);
    
    // Datos de prueba (usuario 30 intentando comentar en solicitud 5)
    const requestId = 5;
    const userId = 30;
    const userCedula = '40244044851';
    const userRole = 'Usuario';
    const comment = 'Este es un comentario de prueba';
    
    console.log(`📋 Datos de prueba:`);
    console.log(`   Request ID: ${requestId}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   User Cédula: ${userCedula}`);
    console.log(`   User Role: ${userRole}`);
    console.log(`   Comment: ${comment}\n`);

    // Paso 1: Verificar que la solicitud existe
    console.log(`🔍 Paso 1: Verificando que la solicitud existe...`);
    const request = await cashRequestRepository.findById(requestId);
    if (request) {
      console.log(`   ✅ Solicitud encontrada:`);
      console.log(`      ID: ${request.id}`);
      console.log(`      Solicitada por ID: ${request.solicitada_porid}`);
      console.log(`      Estado: ${request.solicitud_status}`);
      console.log(`      Tipo: ${request.solicitud_tipo}`);
      console.log(`      ¿solicitada_porid === userId?: ${request.solicitada_porid === userId}`);
    } else {
      console.log(`   ❌ Solicitud NO encontrada`);
      return;
    }

    console.log('');

    // Paso 2: Verificar permisos directamente
    console.log(`🔍 Paso 2: Verificando permisos directamente...`);
    const canComment = await commentService.canUserCommentOnRequest(userId, requestId, userRole);
    console.log(`   ¿Puede comentar?: ${canComment ? '✅ SÍ' : '❌ NO'}`);

    if (!canComment) {
      console.log(`   💡 El usuario NO tiene permisos para comentar`);
      console.log(`   💡 Esto explica el error de permisos`);
      return;
    }

    console.log('');

    // Paso 3: Intentar crear el comentario
    console.log(`🔍 Paso 3: Intentando crear el comentario...`);
    try {
      const result = await commentService.createOrUpdateComment(
        requestId,
        userId,
        userCedula,
        comment,
        userRole
      );
      
      console.log(`   ✅ Comentario creado exitosamente:`);
      console.log(`      ID: ${result.id}`);
      console.log(`      Creado por: ${result.creadoporid}`);
      console.log(`      Solicitud: ${result.solicitudid}`);
      console.log(`      Comentario: ${result.comentario}`);
      
    } catch (error) {
      console.log(`   ❌ Error al crear comentario: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la prueba
testCommentCreationFlow().catch(console.error);
