import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ModulosPermisosService } from '../core/domain/services/modulos-permisos.service';

async function testModulosPermisosFix() {
  console.log('🧪 Iniciando prueba de corrección de ModulosPermisos...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const modulosPermisosService = app.get(ModulosPermisosService);

    // Prueba 1: Crear un nuevo permiso con Module_name
    console.log('\n📝 Prueba 1: Creando permiso con Module_name...');
    const testData = {
      idRol: 1,
      Module_name: 'TestModule_' + Date.now(),
      ver: true,
      agregar: true,
      editar: false,
      eliminar: false
    };

    try {
      const resultado = await modulosPermisosService.createByRolAndModule(testData, 1);
      console.log('✅ Permiso creado exitosamente:');
      console.log(`   - ID: ${resultado.id}`);
      console.log(`   - Módulo ID: ${resultado.idModulo}`);
      console.log(`   - Módulo: ${resultado.modulo}`);
      console.log(`   - Ver: ${resultado.ver}`);
      console.log(`   - Agregar: ${resultado.agregar}`);
      console.log(`   - Editar: ${resultado.editar}`);
      console.log(`   - Eliminar: ${resultado.eliminar}`);
    } catch (error) {
      console.log('❌ Error creando permiso:', error.message);
    }

    // Prueba 2: Intentar crear el mismo permiso (debería fallar)
    console.log('\n📝 Prueba 2: Intentando crear permiso duplicado...');
    try {
      await modulosPermisosService.createByRolAndModule(testData, 1);
      console.log('❌ ERROR: Se permitió crear un permiso duplicado');
    } catch (error) {
      console.log('✅ Correcto: Se previno la creación de permiso duplicado:', error.message);
    }

    // Prueba 3: Obtener permisos por rol
    console.log('\n📝 Prueba 3: Obteniendo permisos por rol...');
    try {
      const permisosByRol = await modulosPermisosService.getPermisosByRol(1);
      console.log(`✅ Se encontraron ${permisosByRol.length} permisos para el rol 1`);
      
      if (permisosByRol.length > 0) {
        console.log('   Primer permiso:');
        const primer = permisosByRol[0];
        console.log(`   - Módulo: ${primer.modulo}`);
        console.log(`   - ID Rol: ${primer.idRol}`);
        console.log(`   - ID Módulo: ${primer.idModulo}`);
        console.log(`   - Ver: ${primer.ver}, Agregar: ${primer.agregar}, Editar: ${primer.editar}, Eliminar: ${primer.eliminar}`);
      }
    } catch (error) {
      console.log('❌ Error obteniendo permisos por rol:', error.message);
    }

    // Prueba 4: Obtener todos los permisos
    console.log('\n📝 Prueba 4: Obteniendo todos los permisos...');
    try {
      const todosLosPermisos = await modulosPermisosService.findAll({ page: 1, limit: 5 });
      console.log(`✅ Se encontraron ${todosLosPermisos.total} permisos en total`);
      console.log(`   Mostrando ${todosLosPermisos.data.length} en la página 1`);
      
      if (todosLosPermisos.data.length > 0) {
        const ultimo = todosLosPermisos.data[todosLosPermisos.data.length - 1];
        console.log('   Último permiso mostrado:');
        console.log(`   - ID: ${ultimo.id}`);
        console.log(`   - Módulo: ${ultimo.modulo || 'N/A'}`);
        console.log(`   - ID Módulo: ${ultimo.idModulo}`);
      }
    } catch (error) {
      console.log('❌ Error obteniendo todos los permisos:', error.message);
    }

    await app.close();
    console.log('\n🎉 Pruebas completadas exitosamente');

  } catch (error) {
    console.error('💥 Error ejecutando las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testModulosPermisosFix()
    .then(() => {
      console.log('✨ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default testModulosPermisosFix;

