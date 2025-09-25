import { DataSource } from 'typeorm';

async function testPermisosQuery() {
  console.log('🔍 Probando consulta de permisos por rol...');
  
  try {
    // Crear conexión directa a la base de datos
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
    console.log('✅ Conexión a base de datos establecida');

    // Primera consulta: Ver qué hay en RolesPermisos
    console.log('\n📊 Datos en RolesPermisos:');
    const rolesPermisos = await dataSource.query(`
      SELECT TOP 10 Id, IdRol, IdPermiso, RowActive 
      FROM RolesPermisos 
      WHERE RowActive = 1
      ORDER BY Id
    `);
    console.table(rolesPermisos);

    // Segunda consulta: Ver qué hay en ModulosPermisos
    console.log('\n📊 Datos en ModulosPermisos:');
    const modulosPermisos = await dataSource.query(`
      SELECT TOP 10 Id, IdModulo, Ver, Agregar, Editar, Eliminar, RowActive 
      FROM ModulosPermisos 
      WHERE RowActive = 1
      ORDER BY Id
    `);
    console.table(modulosPermisos);

    // Tercera consulta: Ver qué hay en Modulos
    console.log('\n📊 Datos en Modulos:');
    const modulos = await dataSource.query(`
      SELECT TOP 15 Id, Modulo, RowActive 
      FROM Modulos 
      WHERE RowActive = 1
      ORDER BY Id
    `);
    console.table(modulos);

    // Cuarta consulta: La consulta corregida
    console.log('\n🔍 Consulta corregida de permisos por rol (idRol = 1):');
    const query = `
      SELECT 
        m.Modulo,
        rp.IdRol,
        mp.IdModulo,
        mp.Ver,
        mp.Agregar,
        mp.Editar,
        mp.Eliminar,
        rp.IdPermiso,
        mp.Id as ModuloPermisoId
      FROM RolesPermisos rp
      LEFT JOIN ModulosPermisos mp ON rp.IdPermiso = mp.Id
      LEFT JOIN Modulos m ON mp.IdModulo = m.Id
      WHERE rp.IdRol = @0 AND rp.RowActive = 1
      ORDER BY m.Id
    `;

    const result = await dataSource.query(query, [1]);
    console.table(result);

    await dataSource.destroy();
    console.log('\n✅ Prueba completada exitosamente');

  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testPermisosQuery()
    .then(() => {
      console.log('✨ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default testPermisosQuery;
