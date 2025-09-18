import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function checkExistingUsers() {
  const logger = new Logger('ExistingUsersCheck');
  
  try {
    logger.log('🔍 Verificando usuarios existentes en la base de datos...');
    
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Verificar base de datos actual
    const currentDB = await dataSource.query('SELECT DB_NAME() as current_database');
    logger.log(`📊 Base de datos actual: ${currentDB[0].current_database}`);
    
    // Obtener usuarios de la vista
    logger.log('1️⃣ Usuarios en la vista vappusuarios:');
    const viewUsers = await dataSource.query(`
      SELECT TOP 10 id, cedula, nombre, apellido, role, valido 
      FROM vappusuarios 
      ORDER BY id DESC
    `);
    
    logger.log(`📊 Total de usuarios en vista: ${viewUsers.length}`);
    viewUsers.forEach((user, index) => {
      logger.log(`   ${index + 1}. ID: ${user.id}, Cédula: ${user.cedula}, Nombre: ${user.nombre} ${user.apellido}, Rol: ${user.role}, Válido: ${user.valido}`);
    });
    
    // Obtener usuarios de la tabla real
    logger.log('\n2️⃣ Usuarios en la tabla real (Appusuarios):');
    const tableUsers = await dataSource.query(`
      SELECT TOP 10 id, cedula, nombre, apellido, role, valido 
      FROM Appusuarios 
      ORDER BY id DESC
    `);
    
    logger.log(`📊 Total de usuarios en tabla: ${tableUsers.length}`);
    tableUsers.forEach((user, index) => {
      logger.log(`   ${index + 1}. ID: ${user.id}, Cédula: ${user.cedula}, Nombre: ${user.nombre} ${user.apellido}, Rol: ${user.role}, Válido: ${user.valido}`);
    });
    
    // Buscar una cédula específica si se proporciona
    const testCedula = '40245980129'; // Cédula de ejemplo
    logger.log(`\n3️⃣ Verificando si existe la cédula: ${testCedula}`);
    
    const existingUser = await dataSource.query(`
      SELECT id, cedula, nombre, apellido, role, valido 
      FROM Appusuarios 
      WHERE cedula = '${testCedula}'
    `);
    
    if (existingUser.length > 0) {
      logger.log(`❌ La cédula ${testCedula} YA EXISTE:`);
      logger.log(`   ID: ${existingUser[0].id}, Nombre: ${existingUser[0].nombre} ${existingUser[0].apellido}, Rol: ${existingUser[0].role}`);
    } else {
      logger.log(`✅ La cédula ${testCedula} NO EXISTE - se puede usar para registro`);
    }
    
    // Mostrar algunas cédulas disponibles (últimas 5)
    logger.log('\n4️⃣ Últimas 5 cédulas registradas:');
    const lastCedulas = await dataSource.query(`
      SELECT TOP 5 cedula, nombre, apellido 
      FROM Appusuarios 
      ORDER BY id DESC
    `);
    
    lastCedulas.forEach((user, index) => {
      logger.log(`   ${index + 1}. Cédula: ${user.cedula} - ${user.nombre} ${user.apellido}`);
    });
    
    await app.close();
    logger.log('✅ Verificación de usuarios completada');
    
  } catch (error) {
    logger.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

checkExistingUsers();
