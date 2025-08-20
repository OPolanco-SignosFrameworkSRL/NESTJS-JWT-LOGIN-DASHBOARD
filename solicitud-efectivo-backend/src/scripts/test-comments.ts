import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CommentService } from '../core/domain/services/comment.service';

async function testComments() {
  console.log('🧪 Iniciando pruebas de comentarios...\n');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const commentService = app.get('CommentServiceInterface');

    console.log('✅ Servicio de comentarios cargado correctamente');

    // Simular datos de prueba
    const testData = {
      requestId: 1,
      userId: 1,
      userCedula: '12345678',
      comment: 'Este es un comentario de prueba',
      userRole: 'Usuario',
    };

    console.log('📝 Datos de prueba:', testData);

    // Probar creación de comentario
    try {
      const newComment = await commentService.createComment(
        testData.requestId,
        testData.userId,
        testData.userCedula,
        testData.comment,
        testData.userRole,
      );

      console.log('✅ Comentario creado exitosamente:', {
        id: newComment.id,
        comentario: newComment.comentario,
        fechacreado: newComment.fechacreado,
      });

      // Probar obtención de comentarios
      const comments = await commentService.getCommentsByRequest(testData.requestId);
      console.log('✅ Comentarios obtenidos:', comments.length);

      // Probar actualización de comentario
      if (newComment.id) {
        const updatedComment = await commentService.updateComment(
          newComment.id,
          testData.userId,
          testData.userRole,
          'Comentario actualizado',
        );

        if (updatedComment) {
          console.log('✅ Comentario actualizado:', updatedComment.comentario);
        }
      }

    } catch (error) {
      console.error('❌ Error en las pruebas:', error.message);
    }

    await app.close();
    console.log('\n🏁 Pruebas completadas');

  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
  }
}

testComments().catch(console.error);
