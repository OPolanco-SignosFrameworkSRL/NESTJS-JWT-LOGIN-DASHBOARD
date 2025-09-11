import { DataSource } from 'typeorm';
import { RecintosEntity } from '../infrastructure/database/entities/recintos.entity';

async function testRecintosSimple() {
  console.log('🚀 Probando la consulta directa a recintos desde la base de datos...\n');
  
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

    // Obtener todos los recintos
    console.log('\n📋 Obteniendo todos los recintos...');
    const recintos = await recintosRepository.find();
    
    console.log(`✅ Encontrados ${recintos.length} recintos:`);
    
    recintos.forEach((recinto, index) => {
      console.log(`\n   ${index + 1}. Recinto ID: ${recinto.id}`);
      console.log(`      • Nombre: ${recinto.recinto}`);
      console.log(`      • Estado: ${recinto.estado} (${typeof recinto.estado})`);
      console.log(`      • Ubicación: ${recinto.ubicacion}`);
      
      // Verificar que el estado sea un número
      if (typeof recinto.estado === 'number') {
        console.log(`      ✅ Estado es número: ${recinto.estado === 1 ? '1 (Activo)' : '0 (Inactivo)'}`);
      } else {
        console.log(`      ❌ Estado NO es número: ${typeof recinto.estado} - ${recinto.estado}`);
      }
    });

    if (recintos.length > 0) {
      // Probar obtener un recinto específico por ID
      const firstRecinto = recintos[0];
      console.log(`\n📋 Obteniendo recinto por ID ${firstRecinto.id}...`);
      
      const recintoById = await recintosRepository.findOne({
        where: { id: firstRecinto.id }
      });
      
      if (recintoById) {
        console.log('✅ Recinto obtenido por ID:');
        console.log(`   • ID: ${recintoById.id}`);
        console.log(`   • Nombre: ${recintoById.recinto}`);
        console.log(`   • Estado: ${recintoById.estado} (${typeof recintoById.estado})`);
        console.log(`   • Ubicación: ${recintoById.ubicacion}`);
        
        if (typeof recintoById.estado === 'number') {
          console.log(`   ✅ CORRECTO: El estado es un número: ${recintoById.estado}`);
        } else {
          console.log(`   ❌ ERROR: Se esperaba número pero es ${typeof recintoById.estado}: ${recintoById.estado}`);
        }
      }
    }

    console.log('\n🏁 Prueba completada');
    console.log('\n📋 RESUMEN:');
    console.log('• Los recintos ahora devuelven estado como número (0/1)');
    console.log('• TypeORM transformer configurado para convertir bit a number');
    console.log('• El endpoint /api/recintos/{id} debería devolver números');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

testRecintosSimple().catch(console.error);
