import axios from 'axios';

async function testFrontendData() {
  console.log('🚀 Probando con los datos exactos del frontend...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  // Datos exactos que envía el frontend
  const frontendData = {
    "agregar": false,
    "editar": false,
    "eliminar": false,
    "idModulo": [{"idModulo": 2}, {"idModulo": 7}],
    "idRol": [{"id": 3}],
    "ver": false
  };
  
  console.log('📤 Datos del frontend:', JSON.stringify(frontendData, null, 2));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Prueba 1: Endpoint INCORRECTO (el que está causando el error)
  console.log('❌ Prueba 1: Enviando a /api/modulos-permisos (INCORRECTO)');
  try {
    const response1 = await axios.post(`${baseUrl}/modulos-permisos`, frontendData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    console.log('✅ Respuesta inesperada:', response1.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Error esperado:', error.response.data.message);
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Prueba 2: Endpoint CORRECTO
  console.log('✅ Prueba 2: Enviando a /api/modulos-permisos/bulk-add-modules-to-role (CORRECTO)');
  try {
    const response2 = await axios.post(`${baseUrl}/modulos-permisos/bulk-add-modules-to-role`, frontendData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    console.log('✅ Respuesta exitosa:', JSON.stringify(response2.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Prueba 3: Formato correcto para el endpoint principal
  console.log('📋 Prueba 3: Formato correcto para /api/modulos-permisos');
  const formatoCorrecto = {
    "idModulo": 8,  // Número simple, no array
    "ver": true,
    "agregar": false,
    "editar": false,
    "eliminar": false
  };
  
  console.log('📤 Formato correcto:', JSON.stringify(formatoCorrecto, null, 2));
  
  try {
    const response3 = await axios.post(`${baseUrl}/modulos-permisos`, formatoCorrecto, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    console.log('✅ Respuesta exitosa:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
  
  console.log('\n🏁 Pruebas completadas');
  console.log('\n📋 RESUMEN:');
  console.log('• Frontend envía formato BulkAddModulesToRoleDto');
  console.log('• Debe usar: POST /api/modulos-permisos/bulk-add-modules-to-role');
  console.log('• NO debe usar: POST /api/modulos-permisos');
}

testFrontendData().catch(console.error);

