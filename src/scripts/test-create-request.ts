import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CashRequestService } from '../core/domain/services/cash-request.service';

async function testCreateRequest() {
  console.log('🧪 Probando creación de solicitud...');
  
  const app = await NestFactory.create(AppModule);
  const cashRequestService = app.get(CashRequestService);
  
  try {
    console.log('✅ Servicio obtenido correctamente');
    
    const testData = {
      monto_solicitado: 3500,
      solicitud_tipo: 3, // Compra de Materiales (aparece en la vista)
      divicionid: 1,
      tipo_pago: 1,
      concepto: 'Materiales para mantenimiento de equipos'
    };
    
    const currentUser = {
      sub: 62233,
      role: 'Admin' as any
    };
    
    console.log('📝 Datos de prueba:', testData);
    console.log('👤 Usuario actual:', currentUser);
    
    const result = await cashRequestService.create(testData, currentUser);
    
    console.log('✅ Solicitud creada exitosamente:');
    console.log(JSON.stringify(result, null, 2));
    
    // Verificar la solicitud creada directamente en la tabla base
    const dataSource = app.get('DataSource');
    const createdSolicitud = await dataSource.query(`
      SELECT TOP 1 * FROM solicitud_desembolso_web 
      WHERE solicitada_porid = ${currentUser.sub} 
      ORDER BY id DESC
    `);
    
    console.log('📊 Solicitud creada en tabla base:');
    console.log(JSON.stringify(createdSolicitud[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error al crear solicitud:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.response) {
      console.error('Response:', error.response);
    }
  } finally {
    await app.close();
  }
}

testCreateRequest(); 