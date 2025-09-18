import axios from 'axios';

async function testHttpUpdate() {
  console.log('🧪 Probando actualización HTTP de solicitud 32790...');
  
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTExMTExMTExIiwic3ViIjo2MjIyNCwiZnVsbG5hbWUiOiJBZG1pbiBTaXN0ZW1hIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU0NDkzNTk1LCJleHAiOjE3NTQ1Nzk5OTUsImF1ZCI6InNvbGljaXR1ZC1lZmVjdGl2by11c2VycyIsImlzcyI6InNvbGljaXR1ZC1lZmVjdGl2by1hcGkifQ.LujO9eeYvnvZvmh8U3qAVSJKN_Q5Fo-MCnAvstHjC34';
    
    const updateData = {
      monto_solicitado: 3500,
      solicitud_tipo: 1,
      divicionid: 1,
      tipo_pago: 1,
      concepto: "Materiales para mantenimiento de equipos - TEST HTTP",
      fecha_requerida: "2024-01-15T10:30:00.000Z"
    };
    
    console.log('📝 Enviando petición PUT...');
    const response = await axios.put('http://localhost:3000/cash-requests/32790', updateData, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta exitosa:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error en la petición HTTP:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testHttpUpdate(); 