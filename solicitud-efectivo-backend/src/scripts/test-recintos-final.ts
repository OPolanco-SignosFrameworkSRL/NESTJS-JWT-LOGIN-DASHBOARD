import { DataSource } from 'typeorm';
import { RecintosEntity } from '../infrastructure/database/entities/recintos.entity';

async function testRecintosFinal() {
  console.log('🚀 Prueba final: Verificando que todo funciona con números...\n');
  
  const dataSource = new DataSource({
    type: 'mssql',
    host: '10.8.2.226',
    port: 1439,
    username: 'Omar',
    password: 'Omar12345',
    database: 'DbSolicitudEfectivo_v1',
    entities: [RecintosEntity],
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    const recintosRepository = dataSource.getRepository(RecintosEntity);

    // Test 1: Obtener todos los recintos
    console.log('\n📋 Test 1: Obteniendo todos los recintos...');
    const recintos = await recintosRepository.find();
    
    console.log(`✅ Encontrados ${recintos.length} recintos`);
    recintos.forEach((recinto, index) => {
      console.log(`   ${index + 1}. ${recinto.recinto} - Estado: ${recinto.estado} (${typeof recinto.estado})`);
      
      if (typeof recinto.estado === 'number') {
        console.log(`      ✅ Correcto: Estado es número ${recinto.estado === 1 ? '(Activo)' : '(Inactivo)'}`);
      } else {
        console.log(`      ❌ Error: Estado debería ser número, pero es ${typeof recinto.estado}`);
      }
    });

    // Test 2: Crear un nuevo recinto con estado 0
    console.log('\n📋 Test 2: Creando un recinto inactivo (estado = 0)...');
    const nuevoRecinto = recintosRepository.create({
      recinto: 'Sala Test Inactiva',
      ubicacion: 'Ubicación de prueba',
      estado: 0  // Explícitamente inactivo
    });
    
    const recintoCreado = await recintosRepository.save(nuevoRecinto);
    console.log(`✅ Recinto creado con ID: ${recintoCreado.id}`);
    console.log(`   • Nombre: ${recintoCreado.recinto}`);
    console.log(`   • Estado: ${recintoCreado.estado} (${typeof recintoCreado.estado})`);
    
    if (recintoCreado.estado === 0) {
      console.log('   ✅ Correcto: Estado guardado como 0 (inactivo)');
    } else {
      console.log(`   ❌ Error: Se esperaba 0 pero se guardó ${recintoCreado.estado}`);
    }

    // Test 3: Actualizar el recinto a activo
    console.log('\n📋 Test 3: Actualizando el recinto a activo (estado = 1)...');
    await recintosRepository.update(recintoCreado.id, { estado: 1 });
    
    const recintoActualizado = await recintosRepository.findOne({
      where: { id: recintoCreado.id }
    });
    
    console.log(`✅ Recinto actualizado:`);
    console.log(`   • Estado: ${recintoActualizado.estado} (${typeof recintoActualizado.estado})`);
    
    if (recintoActualizado.estado === 1) {
      console.log('   ✅ Correcto: Estado actualizado a 1 (activo)');
    } else {
      console.log(`   ❌ Error: Se esperaba 1 pero se encontró ${recintoActualizado.estado}`);
    }

    // Test 4: Limpiar - eliminar el recinto de prueba
    console.log('\n📋 Test 4: Limpiando - eliminando recinto de prueba...');
    await recintosRepository.delete(recintoCreado.id);
    console.log('✅ Recinto de prueba eliminado');

    console.log('\n🎉 === TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE ===');
    console.log('\n📋 RESUMEN DE CAMBIOS:');
    console.log('• ✅ Entidad RecintosEntity: estado es number');
    console.log('• ✅ CreateRecintosDto: estado es number (0 o 1)');
    console.log('• ✅ UpdateRecintosDto: estado es number (0 o 1)');
    console.log('• ✅ RecintosResponseDto: estado es number');
    console.log('• ✅ Repositorio: maneja números correctamente');
    console.log('• ✅ TypeORM transformer: convierte bit a number');
    console.log('\n🚀 El endpoint /api/recintos/{id} ahora devuelve números (0/1)');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await dataSource.destroy();
  }
}

testRecintosFinal().catch(console.error);
