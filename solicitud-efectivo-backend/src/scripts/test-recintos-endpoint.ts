import axios from 'axios';

async function testRecintosEndpoint() {
  console.log('🚀 Probando el endpoint de recintos con estado como número...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  // Primero hacer login para obtener el token
  console.log('🔐 Haciendo login...');
  try {
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      cedula: '40208712480',
      password: '123456'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login exitoso, token obtenido');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Probar endpoint GET /api/recintos (obtener todos)
    console.log('📋 Prueba 1: Obteniendo todos los recintos');
    try {
      const allRecintosResponse = await axios.get(`${baseUrl}/recintos`, { headers });
      console.log('✅ Respuesta exitosa:');
      console.log(`   • Total de recintos: ${allRecintosResponse.data.length || allRecintosResponse.data.data?.length || 0}`);
      
      const recintos = Array.isArray(allRecintosResponse.data) 
        ? allRecintosResponse.data 
        : allRecintosResponse.data.data || [];
        
      if (recintos.length > 0) {
        console.log('   • Primer recinto:');
        const firstRecinto = recintos[0];
        console.log(`     - ID: ${firstRecinto.id}`);
        console.log(`     - Nombre: ${firstRecinto.recinto}`);
        console.log(`     - Estado: ${firstRecinto.estado} (${typeof firstRecinto.estado})`);
        console.log(`     - Ubicación: ${firstRecinto.ubicacion}`);
        
        // Usar el ID del primer recinto para la siguiente prueba
        const testId = firstRecinto.id;
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Probar endpoint GET /api/recintos/{id} (obtener por ID)
        console.log(`📋 Prueba 2: Obteniendo recinto por ID (${testId})`);
        try {
          const recintoByIdResponse = await axios.get(`${baseUrl}/recintos/${testId}`, { headers });
          console.log('✅ Respuesta exitosa:');
          const recinto = recintoByIdResponse.data;
          console.log(`   • ID: ${recinto.id}`);
          console.log(`   • Nombre: ${recinto.recinto}`);
          console.log(`   • Estado: ${recinto.estado} (tipo: ${typeof recinto.estado})`);
          console.log(`   • Ubicación: ${recinto.ubicacion}`);
          
          // Verificar que el estado sea un número
          if (typeof recinto.estado === 'number') {
            console.log('   ✅ CORRECTO: El estado es un número como se esperaba');
            console.log(`   • Valor numérico: ${recinto.estado === 1 ? '1 (Activo)' : '0 (Inactivo)'}`);
          } else {
            console.log(`   ❌ ERROR: Se esperaba un número pero se recibió ${typeof recinto.estado}: ${recinto.estado}`);
          }
          
        } catch (error) {
          if (error.response) {
            console.log('❌ Error en obtener por ID:', error.response.data.message);
          } else {
            console.log('❌ Error de conexión en obtener por ID:', error.message);
          }
        }
        
      } else {
        console.log('   ⚠️ No se encontraron recintos para probar');
      }
      
    } catch (error) {
      if (error.response) {
        console.log('❌ Error en obtener todos:', error.response.data.message);
      } else {
        console.log('❌ Error de conexión en obtener todos:', error.message);
      }
    }
    
    console.log('\n🏁 Pruebas completadas');
    console.log('\n📋 RESUMEN:');
    console.log('• Endpoint: GET /api/recintos/{id}');
    console.log('• Campo estado: Ahora devuelve números (0=Inactivo, 1=Activo)');
    console.log('• Antes: boolean (true/false)');
    console.log('• Ahora: number (0/1)');
    
  } catch (loginError) {
    console.log('❌ Error en login:', loginError.response?.data?.message || loginError.message);
  }
}

testRecintosEndpoint().catch(console.error);
