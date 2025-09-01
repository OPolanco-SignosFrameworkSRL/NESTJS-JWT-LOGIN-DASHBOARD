import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../core/domain/services/auth.service';
import { CryptoService } from '../infrastructure/services/crypto.service';
import { DataSource } from 'typeorm';

async function testAuthentication() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const cryptoService = app.get(CryptoService);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔍 Iniciando prueba de autenticación...\n');

    // Datos de prueba del usuario
    const cedula = '40244044852';
    const password = '9019eeb7b0c12ed45db8569f22a024d19b944695f5e1da1797608292d0e512ff';

    console.log(`📋 Datos de prueba:`);
    console.log(`   Cédula: ${cedula}`);
    console.log(`   Password (hash): ${password}`);
    console.log(`   Password (longitud): ${password.length} caracteres\n`);

    // Verificar si el password es un hash válido
    const isHash = /^[a-fA-F0-9]{64}$/.test(password);
    console.log(`🔐 Análisis del password:`);
    console.log(`   ¿Es hash SHA-256?: ${isHash ? '✅ Sí' : '❌ No'}`);

    if (isHash) {
      console.log(`   Hash válido de 64 caracteres hexadecimales\n`);
    } else {
      console.log(`   No es un hash válido\n`);
    }

    // Verificar usuario en la base de datos
    console.log(`🔍 Verificando usuario en la base de datos...`);
    
    // Consulta directa a la base de datos
    const userQuery = `
      SELECT id, cedula, nombre, apellido, valido, estado
      FROM vappusuarios 
      WHERE cedula = '${cedula}'
    `;
    
    const userWriteQuery = `
      SELECT id, cedula, nombre, apellido, password, codigo, valido
      FROM appusuarios 
      WHERE cedula = '${cedula}'
    `;

    const [userResult, userWriteResult] = await Promise.all([
      dataSource.query(userQuery),
      dataSource.query(userWriteQuery)
    ]);

    console.log(`📊 Resultados de consulta:`);
    console.log(`   Usuario en vista (vappusuarios): ${userResult.length > 0 ? '✅ Encontrado' : '❌ No encontrado'}`);
    console.log(`   Usuario en tabla (appusuarios): ${userWriteResult.length > 0 ? '✅ Encontrado' : '❌ No encontrado'}`);

    if (userResult.length > 0) {
      const user = userResult[0];
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`   Válido: ${user.valido}`);
      console.log(`   Estado: ${user.estado}`);
    }

    if (userWriteResult.length > 0) {
      const userWrite = userWriteResult[0];
      console.log(`   ID (tabla): ${userWrite.id}`);
      console.log(`   Password en BD: ${userWrite.password}`);
      console.log(`   Código en BD: ${userWrite.codigo}`);
      console.log(`   Válido (tabla): ${userWrite.valido}`);
    }

    console.log('');

    // Probar autenticación con AuthService
    console.log(`🔐 Probando autenticación con AuthService...`);
    const authResult = await authService.validateUser(cedula, password);
    
    if (authResult) {
      console.log(`✅ Autenticación exitosa:`);
      console.log(`   ID: ${authResult.id}`);
      console.log(`   Cédula: ${authResult.cedula}`);
      console.log(`   Nombre: ${authResult.nombre} ${authResult.apellido}`);
      console.log(`   Rol: ${authResult.role}`);
    } else {
      console.log(`❌ Autenticación fallida`);
    }

    console.log('');

    // Probar caso de uso de autenticación
    console.log(`🔐 Probando caso de uso de autenticación...`);
    const { AuthenticateUserUseCase } = await import('../core/application/use-cases/authenticate-user.use-case');
    const { UserRepository } = await import('../infrastructure/repositories/user.repository');
    const { CryptoService } = await import('../infrastructure/services/crypto.service');
    
    const userRepo = new UserRepository(
      dataSource.getRepository(require('../infrastructure/database/entities/user.entity').UserEntity),
      dataSource.getRepository(require('../infrastructure/database/entities/user-write.entity').UserWriteEntity)
    );
    
    const cryptoService = new CryptoService();
    const authUseCase = new AuthenticateUserUseCase(userRepo, cryptoService);
    
    const useCaseResult = await authUseCase.execute(cedula, password);
    
    if (useCaseResult) {
      console.log(`✅ Caso de uso exitoso:`);
      console.log(`   ID: ${useCaseResult.id}`);
      console.log(`   Cédula: ${useCaseResult.cedula}`);
      console.log(`   Nombre: ${useCaseResult.nombre} ${useCaseResult.apellido}`);
    } else {
      console.log(`❌ Caso de uso fallido`);
    }

    console.log('');

    // Verificar hashes
    console.log(`🔐 Verificando hashes...`);
    const testPassword = 'password123'; // Contraseña de prueba
    const expectedHash = cryptoService.calculateSHA256(cedula + testPassword);
    console.log(`   Hash esperado (cedula + 'password123'): ${expectedHash}`);
    console.log(`   Hash recibido: ${password}`);
    console.log(`   ¿Coinciden?: ${expectedHash === password ? '✅ Sí' : '❌ No'}`);

    // Si no coinciden, probar con diferentes combinaciones
    if (expectedHash !== password) {
      console.log(`\n🔍 Probando diferentes combinaciones...`);
      
      // Probar solo con la contraseña
      const hashOnlyPassword = cryptoService.calculateSHA256(testPassword);
      console.log(`   Hash (solo 'password123'): ${hashOnlyPassword}`);
      console.log(`   ¿Coincide?: ${hashOnlyPassword === password ? '✅ Sí' : '❌ No'}`);
      
      // Probar con contraseña + cédula
      const hashPasswordCedula = cryptoService.calculateSHA256(testPassword + cedula);
      console.log(`   Hash ('password123' + cedula): ${hashPasswordCedula}`);
      console.log(`   ¿Coincide?: ${hashPasswordCedula === password ? '✅ Sí' : '❌ No'}`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar la prueba
testAuthentication().catch(console.error);
