import { DataSource } from 'typeorm';
import { CryptoService } from '../infrastructure/services/crypto.service';

async function createUserDirect() {
  const dataSource = new DataSource({
    type: 'mssql',
    host: '10.8.2.226',
    port: 1439,
    username: 'Omar',
    password: 'Omar12345',
    database: 'DbSolicitudEfectivo_v1',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
    synchronize: false,
  });
  await dataSource.initialize();

  const cryptoService = new CryptoService();
  const cedula = '40208712480';
  const password = '123456';
  const clave = 'MiClave123';

  // Hash de la contraseña (cedula + password)
  const hashedPassword = cryptoService.calculateSHA256(cedula + password);
  
  // Hash del código (cedula + clave)
  const hashedCodigo = cryptoService.calculateSHA256(cedula + clave);

  try {
    console.log('🔥 CREANDO USUARIO DE PRUEBA...');
    
    // Eliminar usuario existente si existe
    await dataSource.query('DELETE FROM UsuariosRoles WHERE IdUsuario IN (SELECT id FROM Appusuarios WHERE cedula = @0)', [cedula]);
    await dataSource.query('DELETE FROM Appusuarios WHERE cedula = @0', [cedula]);
    
    // Insertar nuevo usuario
    const insertResult = await dataSource.query(`
      INSERT INTO Appusuarios (
        nombre, apellido, cedula, password, codigo, user_email, 
        telefono, direccion, celular, user_status, valido, RowActive,
        CreatedAt, UpdatedAt
      ) 
      OUTPUT INSERTED.id
      VALUES (@0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, GETDATE(), GETDATE())
    `, [
      'Admin',           // nombre
      'Sistema',         // apellido 
      cedula,            // cedula
      hashedPassword,    // password
      hashedCodigo,      // codigo
      'admin@test.com',  // user_email
      '8091234567',      // telefono
      'Calle Admin',     // direccion
      '8097654321',      // celular
      1,                 // user_status
      1,                 // valido
      1                  // RowActive
    ]);

    const userId = insertResult[0].id;
    console.log('✅ Usuario creado con ID:', userId);

    // Insertar rol de administrador
    await dataSource.query(`
      INSERT INTO UsuariosRoles (IdUsuario, IdRol, RowActive, User_Add, CreatedAt, UpdatedAt)
      VALUES (@0, @1, @2, @3, GETDATE(), GETDATE())
    `, [userId, 1, 1, userId]);

    console.log('✅ Rol ADMINISTRADOR asignado');

    console.log('\n🎉 === USUARIO DE PRUEBA CREADO EXITOSAMENTE ===');
    console.log(`📋 Cédula: ${cedula}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🆔 ID: ${userId}`);
    console.log(`🔐 Password Hash: ${hashedPassword}`);
    console.log(`📟 Código Hash: ${hashedCodigo}`);
    console.log('\n🧪 Ahora puedes probar el login con estas credenciales');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

createUserDirect();
