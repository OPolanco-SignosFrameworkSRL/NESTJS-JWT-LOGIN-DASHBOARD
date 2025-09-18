async function testHttpCreate() {
  console.log('🧪 Probando creación HTTP...');
  
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjYyMjQ1OTgwMTI5Iiwic3ViIjo2MjIzMywiZnVsbG5hbWUiOiJQZXBpbiBwYXJtZXNhbm8iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTQ0ODgwNDcsImV4cCI6MTc1NDU3NDQ0NywiYXVkIjoic29saWNpdHVkLWVmZWN0aXZvLXVzZXJzIiwiaXNzIjoic29saWNpdHVkLWVmZWN0aXZvLWFwaSJ9.ftSW28bkCaZoZGNlmRkcDXzgRWdWjvj_K1TbSNS6RbE';
    
    const data = {
      monto_solicitado: 3500,
      solicitud_tipo: 1,
      divicionid: 1,
      tipo_pago: 1,
      concepto: 'Materiales para mantenimiento de equipos'
    };
    
    console.log('📝 Datos a enviar:', data);
    
    const response = await fetch('http://localhost:3000/cash-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    console.log('✅ Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseData = await response.text();
    console.log('Data:', responseData);
    
  } catch (error) {
    console.error('❌ Error en la petición HTTP:');
    console.error('Error:', error);
  }
}

testHttpCreate(); 