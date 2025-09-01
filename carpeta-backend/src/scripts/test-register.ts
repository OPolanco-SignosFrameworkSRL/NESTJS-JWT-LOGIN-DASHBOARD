import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../core/domain/services/auth.service';
import { Logger } from '@nestjs/common';

async function testRegister() {
  const logger = new Logger('TestRegister');
  
  try {
    logger.log('🧪 Probando registro de usuario con la nueva base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const authService = app.get(AuthService);
    
    // Datos de prueba para el registro
    const testUser = {
      cedula: '40245980129',
      nombre: 'Raul',
      apellido: 'Vargas',
      fullname: 'Raul Vargas',
      password: 'password123',
      clave: 'MiClaveSecreta2024',
      role: 'Usuario' as any,
      user_email: 'raul.vargas@grupoastro.com.do',
      telefono: '8091234567',
      direccion: 'Calle Principal #123',
      celular: '8091234567',
      user_status: 1,
      caja_id: '1',
      tienda_id: '1',
      allow_multi_tienda: '0',
      max_descuento: '10.5',
      close_caja: '0',
      user_account_email: 'usuario@email.com',
      user_account_email_passw: 'password123',
      comision_porciento: '5.5',
      default_portalid: '1',
      nuevocampo: 'valor',
      encargadoId: '1'
    };
    
    logger.log('📝 Intentando crear usuario...');
    logger.log(`Cédula: ${testUser.cedula}`);
    logger.log(`Nombre: ${testUser.nombre} ${testUser.apellido}`);
    
    const result = await authService.createUser(testUser);
    
    logger.log('📊 Resultado del registro:');
    logger.log(`Success: ${result.success}`);
    
    if (result.success) {
      logger.log(`✅ Usuario creado exitosamente con ID: ${result.userId}`);
      logger.log('🎉 ¡El registro funcionó correctamente!');
    } else {
      logger.log(`❌ Error: ${result.error}`);
      logger.log('🔍 Verificando si el usuario ya existe...');
      
      // Verificar si el usuario existe
      const existingUser = await authService.checkUserInfo(testUser.cedula);
      logger.log('📋 Información del usuario existente:', existingUser);
    }
    
    await app.close();
    
  } catch (error) {
    logger.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

testRegister();
