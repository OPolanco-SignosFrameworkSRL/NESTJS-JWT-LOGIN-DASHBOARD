import { Injectable, OnModuleInit, OnModuleDestroy, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as sql from 'mssql';
import * as crypto from 'crypto';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private pool: sql.ConnectionPool;
  private readonly CLAVE_FIJA = 'Hola123';

  constructor(private readonly jwtService: JwtService) {}

  async onModuleInit() {
    try {
      this.pool = await sql.connect({
        user: 'sa',
        password: '$ignos1234',
        server: '10.8.2.226',
        port: 1433,
        database: 'DbSolicitudEfectivo',
        options: {
          encrypt: true,
          trustServerCertificate: true,
          connectTimeout: 5000,
          requestTimeout: 10000,
        },
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        }
      });
      console.log('✅ Conexión a base de datos establecida en AuthService');
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close();
    }
  }

  /**
   * Valida las credenciales del usuario usando SHA-256(cedula + claveFija)
   * El password ingresado se ignora, solo se usa la cédula
   */
  async validateUser(cedula: string, _password: string): Promise<any> {
    if (!cedula) {
      return null;
    }
    try {
      const result = await this.pool.request()
        .input('cedula', sql.VarChar, cedula)
        .query(`
          SELECT * FROM [dbo].[vappusuarios]
          WHERE cedula = @cedula AND valido = 1
        `);
      if (result.recordset.length === 0) {
        return null;
      }
      const user = result.recordset[0];
      // Generar el hash esperado
      const expectedHash = this.calculateSHA256(cedula + this.CLAVE_FIJA);
      // Comparar con el hash almacenado
      if (expectedHash !== user.codigo) {
        return null;
      }
      // Usuario válido
      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        fullname: `${user.nombre} ${user.apellido}`,
        role: user.role || 'Usuario',
        user_email: user.user_email || `${user.cedula}@grupoastro.com.do`,
        division: user.division || 'N/A',
        cargo: user.cargo || 'N/A',
        dependencia: user.dependencia || 'N/A',
        recinto: user.recinto || 'N/A',
        estado: user.estado || 'ACTIVO'
      };
    } catch (error) {
      console.error('❌ Error validando usuario:', error);
      return null;
    }
  }

  /**
   * Calcula el hash SHA-256 de un string
   */
  private calculateSHA256(input: string): string {
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  }

  /**
   * Genera el token JWT para el usuario autenticado
   */
  async login(user: any) {
    const payload = {
      username: user.cedula,
      sub: user.id,
      fullname: user.fullname,
      role: user.role
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        cedula: user.cedula,
        fullname: user.fullname,
        role: user.role,
        user_email: user.user_email
      }
    };
  }

  /**
   * Obtiene información del usuario para debugging
   */
  async checkUserInfo(cedula: string): Promise<any> {
    try {
      const result = await this.pool.request()
        .input('cedula', sql.VarChar, cedula)
        .query(`
          SELECT id, cedula, nombre, apellido, codigo, valido, role, user_email,
                 division, cargo, dependencia, recinto, estado
          FROM [dbo].[vappusuarios]
          WHERE cedula = @cedula
        `);
      if (result.recordset.length === 0) {
        return { error: 'Usuario no encontrado' };
      }
      const user = result.recordset[0];
      const hashInput = cedula + this.CLAVE_FIJA;
      const expectedHash = this.calculateSHA256(hashInput);
      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.codigo,
        valido: user.valido,
        role: user.role,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
        estado: user.estado,
        debug: {
          hashInput: hashInput,
          expectedHash: expectedHash,
          hashMatches: expectedHash === user.codigo
        }
      };
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      return { error: 'Error interno del servidor' };
    }
  }
} 