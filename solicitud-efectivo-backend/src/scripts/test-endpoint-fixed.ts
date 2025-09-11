import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';

async function testEndpoints() {
  console.log('🚀 Iniciando pruebas de endpoints...\n');
  
  let app: INestApplication;
  
  try {
    // Crear la aplicación Nest (sin iniciar servidor HTTP)
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    
    // Obtener el servicio directamente
    const modulosPermisosService = app.get('ModulosPermisosService');
    
    console.log('✅ Aplicación inicializada correctamente\n');
    
    // Prueba 1: Método addModuleToRole (formato correcto)
    console.log('📝 Prueba 1: addModuleToRole con parámetros válidos');
    try {
      const resultado1 = await modulosPermisosService.addModuleToRole(
        3,  // idRol
        4,  // idModulo 
        1,  // userId
        { ver: false, agregar: false, editar: false, eliminar: false }  // options
      );
      console.log('✅ addModuleToRole exitoso:', {
        id: resultado1.id,
        idModulo: resultado1.idModulo,
        ver: resultado1.ver,
        agregar: resultado1.agregar
      });
    } catch (error) {
      console.log('❌ Error en addModuleToRole:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Prueba 2: Método create con formato correcto
    console.log('📝 Prueba 2: create con formato de objeto simple');
    try {
      const resultado2 = await modulosPermisosService.create({
        idModulo: 5,
        ver: true,
        agregar: false,
        editar: false,
        eliminar: false
      }, 1);
      console.log('✅ create exitoso:', {
        id: resultado2.id,
        idModulo: resultado2.idModulo,
        ver: resultado2.ver
      });
    } catch (error) {
      console.log('❌ Error en create:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Prueba 3: Simular el error - enviar objeto donde espera número
    console.log('📝 Prueba 3: create con formato INCORRECTO (simular error)');
    try {
      const resultado3 = await modulosPermisosService.create({
        idModulo: { idModulo: 6 }, // ❌ INCORRECTO: objeto en lugar de número
        ver: true,
        agregar: false,
        editar: false,
        eliminar: false
      } as any, 1);
      console.log('✅ create exitoso (no debería llegar aquí):', resultado3);
    } catch (error) {
      console.log('✅ Error esperado capturado:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Prueba 4: Verificar datos en base de datos
    console.log('📝 Prueba 4: Consultar permisos existentes');
    try {
      const permisos = await modulosPermisosService.findAll({}, 1, 5);
      console.log('✅ Permisos encontrados:', permisos.data.length);
      if (permisos.data.length > 0) {
        console.log('📋 Ejemplo de permiso:', {
          id: permisos.data[0].id,
          idModulo: permisos.data[0].idModulo,
          moduloNombre: permisos.data[0].moduloNombre,
          ver: permisos.data[0].ver
        });
      }
    } catch (error) {
      console.log('❌ Error consultando permisos:', error.message);
    }
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
  } finally {
    if (app) {
      await app.close();
    }
  }
  
  console.log('\n🏁 Pruebas completadas');
}

// Ejecutar las pruebas
testEndpoints().catch(console.error);

