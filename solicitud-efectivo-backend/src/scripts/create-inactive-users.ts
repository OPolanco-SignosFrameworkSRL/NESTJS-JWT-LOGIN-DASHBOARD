import { DataSource } from 'typeorm';
import { CryptoService } from '../infrastructure/services/crypto.service';

async function createInactiveUsers() {
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

  try {
    console.log('🔥 CREANDO USUARIOS INACTIVOS PARA PRUEBA...');
    
    // Crear 3 usuarios inactivos
    for (let i = 1; i <= 3; i++) {
      const cedula = `40000000${i.toString().padStart(3, '0')}`;
      const password = '123456';
      const clave = 'MiClave123';

      const hashedPassword = cryptoService.calculateSHA256(cedula + password);
      const hashedCodigo = cryptoService.calculateSHA256(cedula + clave);

      // Eliminar si existe
      await dataSource.query('DELETE FROM UsuariosRoles WHERE IdUsuario IN (SELECT id FROM Appusuarios WHERE cedula = @0)', [cedula]);
      await dataSource.query('DELETE FROM Appusuarios WHERE cedula = @0', [cedula]);
      
      // Crear usuario INACTIVO
      const insertResult = await dataSource.query(`
        INSERT INTO Appusuarios (
          nombre, apellido, cedula, password, codigo, user_email, 
          telefono, direccion, celular, user_status, valido, RowActive,
          CreatedAt, UpdatedAt
        ) 
        OUTPUT INSERTED.id
        VALUES (@0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11, GETDATE(), GETDATE())
      `, [
        `Usuario${i}`,           // nombre
        'Inactivo',              // apellido 
        cedula,                  // cedula
        hashedPassword,          // password
        hashedCodigo,            // codigo
        `inactive${i}@test.com`, // user_email
        '8091234567',            // telefono
        'Calle Inactiva',        // direccion
        '8097654321',            // celular
        1,                       // user_status
        0,                       // valido = 0 (INACTIVO)
        1                        // RowActive
      ]);

      const userId = insertResult[0].id;
      
      // Asignar rol usuario (id 2)
      await dataSource.query(`
        INSERT INTO UsuariosRoles (IdUsuario, IdRol, RowActive, User_Add, CreatedAt, UpdatedAt)
        VALUES (@0, @1, @2, @3, GETDATE(), GETDATE())
      `, [userId, 2, 1, userId]);

      console.log(`✅ Usuario INACTIVO ${i} creado - ID: ${userId}, Cédula: ${cedula}`);
    }

    console.log('\n🎉 === USUARIOS INACTIVOS CREADOS ===');
    console.log('📋 Cédulas: 40000000001, 40000000002, 40000000003');
    console.log('🔑 Password para todos: 123456');
    console.log('❌ Todos tienen valido = 0 (INACTIVOS)');
    console.log('\n🧪 Ahora puedes probar el filtro active=false');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

createInactiveUsers();
