import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';
import {
  IUser,
  IUserPayload,
  ILoginResponse,
  IUserCreateData,
  UserRole,
} from '../../domain/interfaces/user.interface';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  

  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWriteEntity)
    private readonly userWriteRepository: Repository<UserWriteEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Valida las credenciales del usuario (cédula y contraseña).
   * La validación del campo 'codigo' se ha eliminado de este flujo de login principal,
   * ya que 'clave' no es parte del LoginDto y 'codigo' ahora se deriva de una clave
   * proporcionada solo durante el registro.
   */
  async validateUser(cedula: string, password: string): Promise<IUser | null> {

   

    if (!cedula || !password) {
      return null;
    }

    try {
      // Buscar usuario en la vista para obtener datos completos
      const user = await this.userRepository.findOne({
        where: { cedula, valido: '1' },
      });

      if (!user) {
        this.logger.warn(`Usuario no encontrado: ${cedula}`);
        return null;
      }

      // Buscar usuario en la tabla real para obtener la contraseña
      const userWrite = await this.userWriteRepository.findOne({
        where: { cedula },
      });

      if (!userWrite) {
        this.logger.warn(
          `Usuario no encontrado en tabla de escritura: ${cedula}`,
        );
        return null;
      }

      // Verificar si el password ya es un hash (64 caracteres hexadecimales)
      const isHash = /^[a-fA-F0-9]{64}$/.test(password);
      
      let hashedPassword: string;
      if (isHash) {
        // Si ya es un hash, usarlo directamente
        hashedPassword = password;
        this.logger.log(`Password detectado como hash para usuario: ${cedula}`);
      } else {
        // Si no es hash, calcular el hash (cedula + password)
        hashedPassword = this.cryptoService.calculateSHA256(cedula + password);
        this.logger.log(`Password hasheado para usuario: ${cedula}`);
      }
      
      if (hashedPassword !== userWrite.password) {
        this.logger.warn(`Contraseña inválida para usuario: ${cedula}`);
        this.logger.warn(`Hash recibido: ${hashedPassword}`);
        this.logger.warn(`Hash esperado: ${userWrite.password}`);
        return null;
      }

      // La validación del 'codigo' (clave dinámica) se ha eliminado de aquí.
      // Si el 'codigo' se usará para alguna otra validación (ej. 2FA, API Key),
      // esa lógica debería implementarse en un punto separado o con un DTO de login diferente.

      // Usuario válido
      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        fullname: user.getFullName(),
        role: user.role as UserRole,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
        estado: user.estado,
        valido: user.valido,
      };
    } catch (error) {
      this.logger.error(`Error validando usuario ${cedula}:`, error);
      return null;
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * Ahora el campo 'codigo' se genera hasheando la cédula y la clave proporcionada por el usuario.
   */
  async createUser(data: IUserCreateData): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    userId?: number;
  }> {
    try {
      // Verificar si el usuario ya existe en la TABLA REAL (no en la vista)
      const existingUser = await this.userWriteRepository.findOne({
        where: { cedula: data.cedula },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Ya existe un usuario con esta cédula',
        };
      }

      // Hash de la contraseña del usuario (cedula + clave)
      const codigoHash = this.cryptoService.calculateSHA256(
        data.cedula + data.clave,
      );

      // Hash para el campo 'codigo' (fórmula diferente: cedula + password)
      const hashedPassword = this.cryptoService.calculateSHA256(
        data.cedula + data.password,
      );

      // Crear el nuevo usuario en la tabla real
      const newUser = this.userWriteRepository.create({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        codigo: codigoHash,
        password: hashedPassword, // Usar hashedPassword, no codigoHash
        role: data.role || 'Usuario',
        user_email: data.user_email,
        telefono: data.telefono,
        direccion: data.direccion,
        celular: data.celular,
        user_status: data.user_status || 1,
        caja_id: data.caja_id,
        tienda_id: data.tienda_id,
        allow_multi_tienda: data.allow_multi_tienda || '0',
        max_descuento: data.max_descuento,
        close_caja: data.close_caja || '0',
        user_account_email: data.user_account_email,
        user_account_email_passw: data.user_account_email_passw,
        comision_porciento: data.comision_porciento,
        default_portalid: data.default_portalid,
        nuevocampo: data.nuevocampo,
        encargadoId: data.encargadoId,
        passwchanged: '0',
        valido: '1',
      });

      const savedUser = await this.userWriteRepository.save(newUser);

      this.logger.log(`Usuario creado exitosamente: ${data.cedula} con ID: ${savedUser.id}`);

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        userId: savedUser.id,
      };
    } catch (error) {
      this.logger.error(`Error creando usuario ${data.cedula}:`, error);
      
      // Manejar errores específicos de SQL Server
      if (error.message && error.message.includes('duplicate key')) {
        return {
          success: false,
          error: 'Ya existe un usuario con esta cédula',
        };
      }
      
      return {
        success: false,
        error: `Error interno del servidor: ${error.message}`,
      };
    }
  }

  /**
   * Genera el token JWT para el usuario autenticado
   */
  async login(user: IUser): Promise<ILoginResponse> {
    const payload: IUserPayload = {
      username: user.cedula,
      sub: user.id,
      fullname: user.fullname,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    this.logger.log(`Login exitoso para usuario: ${user.cedula}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        cedula: user.cedula,
        fullname: user.fullname,
        apellido: user.apellido,
        role: user.role,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
      },
      expires_in: this.parseExpiresIn(expiresIn),
    };
  }

  /**
   * Obtiene información del usuario para debugging.
   * Ahora 'codigo' mostrará el hash de la clave dinámica generada a partir de cedula + clave_proporcionada.
   */
  async checkUserInfo(cedula: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { cedula } });

      if (!user) {
        return { error: 'Usuario no encontrado' };
      }

      // No podemos recrear el 'expectedHash' para 'codigo' aquí sin la 'clave' original
      // que fue proporcionada durante el registro.
      // El 'codigo' almacenado es el hash de (cedula + clave_original_de_registro).

      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.codigo, // Este es ahora el hash de (cedula + clave_proporcionada_en_registro)
        valido: user.valido,
        role: user.role,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
        estado: user.estado,
        debug: {
          message:
            'El campo "codigo" ahora contiene el hash de la combinación de la cédula y la clave proporcionada por el usuario durante el registro.',
          // No hay 'hashInput' o 'expectedHash' para comparar aquí sin la clave original.
        },
      };
    } catch (error) {
      this.logger.error(
        `Error obteniendo información del usuario ${cedula}:`,
        error,
      );
      return { error: 'Error interno del servidor' };
    }
  }

  /**
   * Verifica si un token JWT es válido
   */
  async verifyToken(token: string): Promise<IUserPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('Error verificando token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Convierte expiresIn string a segundos
   */
  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 24 * 60 * 60; // 24 horas por defecto
    }
  }

  /**
   * Método para verificar el hasheo según el ejemplo proporcionado
   */
  async testHashing(): Promise<any> {
    try {
      const cedula = '12245980129';
      const password = '456789';
      const clave = 'MiClaveSecreta2024'; // Ejemplo de clave
      
      // Hash para password (cedula + clave)
      const passwordHash = this.cryptoService.calculateSHA256(cedula + clave);
      
      // Hash para codigo (cedula + password)
      const codigoHash = this.cryptoService.calculateSHA256(cedula + password);
      
      // Hash esperado según el ejemplo
      const expectedHash = '13e85726a3b1d0c46560a5d90dd9d042d1e4c4ac117fa3bf0c41b4306ad1ac6e';
      
      this.logger.log('=== PRUEBA DE HASHEO ===');
      this.logger.log(`Cédula: ${cedula}`);
      this.logger.log(`Password: ${password}`);
      this.logger.log(`Clave: ${clave}`);
      this.logger.log(`Hash Password (cedula + clave): ${passwordHash}`);
      this.logger.log(`Hash Código (cedula + password): ${codigoHash}`);
      this.logger.log(`Hash Esperado: ${expectedHash}`);
      this.logger.log(`¿Coincide Código?: ${codigoHash === expectedHash}`);
      
      return {
        cedula,
        password,
        clave,
        passwordHash,
        codigoHash,
        expectedHash,
        codigoMatches: codigoHash === expectedHash,
        passwordHashLength: passwordHash.length,
        codigoHashLength: codigoHash.length
      };
    } catch (error) {
      this.logger.error('Error en prueba de hasheo:', error);
      return { error: error.message };
    }
  }

  /**
   * Método para verificar los hashes de un usuario específico
   */
  async checkUserHashes(cedula: string): Promise<any> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { cedula },
      });

      if (!userWrite) {
        return { error: 'Usuario no encontrado' };
      }

      // Calcular hashes esperados
      const passwordHash = this.cryptoService.calculateSHA256(cedula + 'password123'); // Asumiendo password123
      const codigoHash = this.cryptoService.calculateSHA256(cedula + 'password123'); // Mismo que password

      this.logger.log('=== VERIFICACIÓN DE HASHES ===');
      this.logger.log(`Cédula: ${cedula}`);
      this.logger.log(`Password en BD: ${userWrite.password}`);
      this.logger.log(`Código en BD: ${userWrite.codigo}`);
      this.logger.log(`Hash esperado (cedula + password123): ${passwordHash}`);
      this.logger.log(`¿Password coincide?: ${userWrite.password === passwordHash}`);
      this.logger.log(`¿Código coincide?: ${userWrite.codigo === codigoHash}`);

      return {
        cedula,
        passwordInDB: userWrite.password,
        codigoInDB: userWrite.codigo,
        expectedPasswordHash: passwordHash,
        expectedCodigoHash: codigoHash,
        passwordMatches: userWrite.password === passwordHash,
        codigoMatches: userWrite.codigo === codigoHash
      };
    } catch (error) {
      this.logger.error('Error verificando hashes:', error);
      return { error: error.message };
    }
  }

  /**
   * Método temporal para verificar el esquema de la base de datos
   */
  async checkDatabaseSchema(): Promise<any> {
    try {
      // Consulta 1: Esquema completo
      const schemaQuery = `
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          ORDINAL_POSITION
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'appusuarios'
        ORDER BY ORDINAL_POSITION
      `;
      
      // Consulta 2: Campos numéricos (posibles bigint)
      const numericQuery = `
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'appusuarios'
          AND DATA_TYPE IN ('bigint', 'int', 'smallint', 'tinyint')
        ORDER BY ORDINAL_POSITION
      `;
      
      // Consulta 3: Campos de texto
      const textQuery = `
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'appusuarios'
          AND DATA_TYPE LIKE '%char%'
        ORDER BY ORDINAL_POSITION
      `;
      
      // Consulta 4: Datos actuales
      const dataQuery = `
        SELECT TOP 5 *
        FROM appusuarios
        ORDER BY id DESC
      `;
      
      // Consulta 5: Contar registros
      const countQuery = `
        SELECT COUNT(*) as total_registros
        FROM appusuarios
      `;
      
      const [schema, numericFields, textFields, data, count] = await Promise.all([
        this.dataSource.query(schemaQuery),
        this.dataSource.query(numericQuery),
        this.dataSource.query(textQuery),
        this.dataSource.query(dataQuery),
        this.dataSource.query(countQuery)
      ]);
      
      this.logger.log('Análisis completo de la tabla appusuarios completado');
      
      return {
        schema: schema,
        numericFields: numericFields,
        textFields: textFields,
        sampleData: data,
        totalRecords: count[0]?.total_registros || 0,
        analysis: {
          totalColumns: schema.length,
          numericColumns: numericFields.length,
          textColumns: textFields.length
        }
      };
    } catch (error) {
      this.logger.error('Error verificando esquema:', error);
      return { error: error.message };
    }
  }

  /**
   * Busca un usuario por cédula y contraseña, y actualiza su teléfono si existe.
   * La contraseña se valida usando el hash SHA-256 de (cedula + clave).
   */
  async updateUserPhone(
    cedula: string, 
    clave: string, 
    telefono: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      if (!cedula || !clave || !telefono) {
        throw new UnauthorizedException('Cédula, clave y teléfono son requeridos');
      }

      // Generar el hash de la contraseña (cedula + clave)
      const passwordHash = this.cryptoService.calculateSHA256(cedula + clave);

      // Buscar usuario en la tabla real usando cédula y hash de contraseña
      const user = await this.userWriteRepository.findOne({
        where: { 
          cedula,
          password: passwordHash,
          valido: '1' 
        },
      });

      if (!user) {
        this.logger.warn(`Credenciales inválidas para cédula: ${cedula}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Actualizar el número de teléfono
      user.telefono = telefono;
      
      await this.userWriteRepository.save(user);

      this.logger.log(`Teléfono actualizado para usuario: ${cedula}`);

      return {
        success: true,
        message: 'Teléfono actualizado exitosamente',
        user: {
          id: user.id,
          cedula: user.cedula,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: telefono, // Campo actualizado
        }
      };

    } catch (error) {
      this.logger.error(`Error actualizando teléfono para usuario ${cedula}:`, error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Error interno del servidor');
    }
  }
}