import axios from 'axios';

async function testUsersByStatus() {
  console.log('🚀 Probando el nuevo endpoint de usuarios por status...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  // Primero hacer login para obtener el token
  console.log('🔐 Haciendo login...');
  try {
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      cedula: '00000000001',
      password: 'admin123'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login exitoso, token obtenido');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Probar endpoint con statusId = 1 (usuarios activos)
    console.log('📋 Prueba 1: Obteniendo usuarios activos (statusId = 1)');
    try {
      const response1 = await axios.get(`${baseUrl}/users/by-status/1`, { headers });
      console.log('✅ Respuesta exitosa:');
      console.log(`   • Total de usuarios activos: ${response1.data.data.length}`);
      console.log(`   • Status Code: ${response1.data.statusCode}`);
      console.log(`   • Message: ${response1.data.message}`);
      
      if (response1.data.data.length > 0) {
        console.log('   • Primer usuario:');
        const firstUser = response1.data.data[0];
        console.log(`     - ID: ${firstUser.id}`);
        console.log(`     - Nombre: ${firstUser.nombre} ${firstUser.apellido}`);
        console.log(`     - Cédula: ${firstUser.cedula}`);
        console.log(`     - Estado: ${firstUser.valido ? 'Activo' : 'Inactivo'}`);
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ Error:', error.response.data.message);
      } else {
        console.log('❌ Error de conexión:', error.message);
      }
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Probar endpoint con statusId = 2 (usuarios inactivos)
    console.log('📋 Prueba 2: Obteniendo usuarios inactivos (statusId = 2)');
    try {
      const response2 = await axios.get(`${baseUrl}/users/by-status/2`, { headers });
      console.log('✅ Respuesta exitosa:');
      console.log(`   • Total de usuarios inactivos: ${response2.data.data.length}`);
      console.log(`   • Status Code: ${response2.data.statusCode}`);
      console.log(`   • Message: ${response2.data.message}`);
      
      if (response2.data.data.length > 0) {
        console.log('   • Primer usuario inactivo:');
        const firstUser = response2.data.data[0];
        console.log(`     - ID: ${firstUser.id}`);
        console.log(`     - Nombre: ${firstUser.nombre} ${firstUser.apellido}`);
        console.log(`     - Cédula: ${firstUser.cedula}`);
        console.log(`     - Estado: ${firstUser.valido ? 'Activo' : 'Inactivo'}`);
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ Error:', error.response.data.message);
      } else {
        console.log('❌ Error de conexión:', error.message);
      }
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Probar endpoint con statusId inválido
    console.log('📋 Prueba 3: Probando con statusId inválido (statusId = 99)');
    try {
      const response3 = await axios.get(`${baseUrl}/users/by-status/99`, { headers });
      console.log('⚠️ Respuesta inesperada:', response3.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Error esperado:', error.response.data.message);
      } else {
        console.log('❌ Error de conexión:', error.message);
      }
    }
    
    console.log('\n🏁 Pruebas completadas');
    console.log('\n📋 RESUMEN del endpoint:');
    console.log('• URL: GET /api/users/by-status/{statusId}');
    console.log('• Parámetros: statusId (1=Activos, 2=Inactivos)');
    console.log('• Requiere: Token JWT (Admin o Supervisor)');
    console.log('• Respuesta: Lista de usuarios filtrados por status');
    
  } catch (loginError) {
    console.log('❌ Error en login:', loginError.response?.data?.message || loginError.message);
  }
}

testUsersByStatus().catch(console.error);
