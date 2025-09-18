import fetch from 'node-fetch';

async function testEndpoint() {
  console.log('🌐 Probando endpoint /api/modulos-permisos...');
  
  try {
    // Esperar un poco para que la app inicie
    console.log('⏳ Esperando que la aplicación inicie...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Probar GET de permisos por rol
    console.log('\n📝 Probando GET /api/modulos-permisos/by-rol/1');
    const response = await fetch('http://localhost:3000/api/modulos-permisos/by-rol/1');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log('   Estructura completa de la respuesta:', JSON.stringify(data, null, 2));
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   Total de permisos: ${data.length}`);
        console.log('   Primeros 3 permisos:');
        data.slice(0, 3).forEach((permiso: any, index: number) => {
          console.log(`   ${index + 1}. ${permiso.modulo} - Ver: ${permiso.ver}, Agregar: ${permiso.agregar}, Editar: ${permiso.editar}, Eliminar: ${permiso.eliminar}`);
        });
      }
    } else {
      console.log('❌ Error en la respuesta:', response.status, response.statusText);
      const error = await response.text();
      console.log('Error details:', error);
    }

    // Probar POST para crear un nuevo permiso
    console.log('\n📝 Probando POST /api/modulos-permisos');
    const postData = {
      idRol: 1,
      Module_name: 'TestEndpoint_' + Date.now(),
      ver: true,
      agregar: false,
      editar: true,
      eliminar: false
    };

    const postResponse = await fetch('http://localhost:3000/api/modulos-permisos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });

    if (postResponse.ok) {
      const postResult = await postResponse.json();
      console.log('✅ Permiso creado exitosamente:');
      console.log('   Estructura completa del resultado:', JSON.stringify(postResult, null, 2));
    } else {
      console.log('❌ Error creando permiso:', postResponse.status, postResponse.statusText);
      const error = await postResponse.text();
      console.log('Error details:', error);
    }

  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testEndpoint()
    .then(() => {
      console.log('\n✨ Prueba del endpoint completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default testEndpoint;
