import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class VappusuariosService implements OnModuleInit, OnModuleDestroy {
  private pool: sql.ConnectionPool;

  async onModuleInit() {
    // Configuración optimizada para conexión más rápida
    this.pool = await sql.connect({
      user: 'sa',
      password: '$ignos1234',
      server: '10.8.2.226',
      port: 1433,
      database: 'DbSolicitudEfectivo',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: 5000, // 5 segundos timeout
        requestTimeout: 10000, // 10 segundos timeout
      },
      pool: {
        max: 10, // Máximo 10 conexiones
        min: 0, // Mínimo 0 conexiones
        idleTimeoutMillis: 30000, // 30 segundos idle
      }
    });
  }

  async onModuleDestroy() {
    await this.pool.close();
  }

  async findAll() {
    const result = await this.pool.request().query('SELECT * FROM [dbo].[vappusuarios]');
    return result.recordset;
  }
}
