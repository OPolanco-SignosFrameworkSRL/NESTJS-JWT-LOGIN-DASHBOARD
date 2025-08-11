import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GetCommentsUseCase } from '../core/application/use-cases/get-comments.use-case';

async function testAdminViewComments() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🔍 Probando que los Administradores pueden ver Comentarios\n');

    // Obtener el caso de uso
    const getCommentsUseCase = app.get(GetCommentsUseCase);
    
    // Probar con la solicitud ID = 5 (que ya tiene un comentario)
    const requestId = 5;
    console.log(`📋 Probando obtener comentarios para solicitud ID = ${requestId}...`);
    
    try {
      const comments = await getCommentsUseCase.execute({ requestId });
      
      console.log(`   ✅ Comentarios obtenidos exitosamente:`);
      console.log(`   📊 Total de comentarios: ${comments.length}`);
      
      if (comments.length > 0) {
        comments.forEach((comment, index) => {
          console.log(`   ${index + 1}. Comentario ID: ${comment.id}`);
          console.log(`      Creado por ID: ${comment.creadoporid}`);
          console.log(`      Cédula: ${comment.creadopor_cedula}`);
          console.log(`      Fecha: ${comment.fechacreado}`);
          console.log(`      Contenido: ${comment.comentario}`);
          console.log('');
        });
      } else {
        console.log(`   ℹ️ No hay comentarios para esta solicitud`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error obteniendo comentarios: ${error.message}`);
    }

    console.log('');

    // Probar con otra solicitud que no tenga comentarios
    const requestId2 = 3;
    console.log(`📋 Probando obtener comentarios para solicitud ID = ${requestId2}...`);
    
    try {
      const comments2 = await getCommentsUseCase.execute({ requestId: requestId2 });
      
      console.log(`   ✅ Comentarios obtenidos exitosamente:`);
      console.log(`   📊 Total de comentarios: ${comments2.length}`);
      
      if (comments2.length > 0) {
        comments2.forEach((comment, index) => {
          console.log(`   ${index + 1}. Comentario ID: ${comment.id}`);
          console.log(`      Creado por ID: ${comment.creadoporid}`);
          console.log(`      Cédula: ${comment.creadopor_cedula}`);
          console.log(`      Fecha: ${comment.fechacreado}`);
          console.log(`      Contenido: ${comment.comentario}`);
          console.log('');
        });
      } else {
        console.log(`   ℹ️ No hay comentarios para esta solicitud`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error obteniendo comentarios: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la prueba
testAdminViewComments().catch(console.error);
