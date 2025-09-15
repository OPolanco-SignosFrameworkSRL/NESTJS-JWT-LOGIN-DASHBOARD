import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SolicitudEfectivoEntity } from '../../../infrastructure/database/entities/solicitud-efectivo.entity';
import { IntegranteDesembolsoEntity } from '../../../infrastructure/database/entities/integrante-desembolso.entity';
import { UsersService } from './users.service';
import { IUserPayload } from '../interfaces/user.interface';
import { CreateSolicitudDto } from '../../application/dto/create-solicitud.dto';
import { SolicitudEfectivoStatus, SolicitudEfectivoType, Division } from '../interfaces/solicitud-efectivo.interface';

@Injectable()
export class SolicitudEfectivoService {
  private readonly logger = new Logger(SolicitudEfectivoService.name);

  constructor(
    @InjectRepository(SolicitudEfectivoEntity)
    private solicitudRepository: Repository<SolicitudEfectivoEntity>,
    @InjectRepository(IntegranteDesembolsoEntity)
    private integranteRepository: Repository<IntegranteDesembolsoEntity>,
    private usersService: UsersService,
    private dataSource: DataSource
  ) {}

  async create(createDto: CreateSolicitudDto, currentUser: IUserPayload) {
    // 👤 Validar usuario autenticado
    const user = await this.usersService.findOne(currentUser.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (!user.valido) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // 💸 Validar reglas de negocio
    this.validateBusinessRules(createDto);

    try {
      // 🧪 Crear solicitud con estado inicial fijo "pendiente"
      const solicitud = this.solicitudRepository.create({
        usuarioId: currentUser.sub,
        monto: createDto.monto,
        tipoSolicitudId: createDto.tipoSolicitudId,
        tipoPagoId: createDto.tipoPagoId,
        divisionId: createDto.divisionId,
        fechaOrden: new Date(createDto.fechaOrden),
        numeroOrden: createDto.numeroOrden,
        nombreCliente: createDto.nombreCliente,
        numeroTicket: createDto.numeroTicket,
        concepto: createDto.concepto,
        statusId: SolicitudEfectivoStatus.PENDIENTE, // Usar enum como en cash-request
      });
      
      const savedSolicitud = await this.solicitudRepository.save(solicitud);
      
      try {
        // Crear integrantes con tipos correctos según la BD
        const integrantes = createDto.integrantes.map(integrante => {
          const integranteData = {
            solicitudId: savedSolicitud.id,
            fullname: integrante.fullname,
            cedula: integrante.cedula,
            beneficiario: integrante.beneficiario,
            monto: integrante.monto,
            tareaAsignada: integrante.tareaAsignada || null
          };
          return this.integranteRepository.create(integranteData);
        });
        
        await this.integranteRepository.save(integrantes);
        this.logger.log(`Integrantes guardados correctamente para solicitud ${savedSolicitud.id}`);
      } catch (integranteError) {
        this.logger.error(`Error guardando integrantes: ${integranteError.message}`);
        // Continuar sin integrantes si fallan
      }

      // 📊 Enriquecer respuesta con datos de usuario
      const solicitudCompleta = await this.solicitudRepository.findOne({
        where: { id: savedSolicitud.id },
        relations: ['integrantes']
      });

      return {
        ...solicitudCompleta,
        mensaje: 'Solicitud creada exitosamente',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.logger.error(`Error creando solicitud: ${error.message}`);
      throw error;
    }
  }

    // 💸 Validar reglas de negocio
  private validateBusinessRules(createDto: CreateSolicitudDto) {
    if (createDto.monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    if (!createDto.concepto || createDto.concepto.trim().length === 0) {
      throw new BadRequestException('El concepto es obligatorio');
    }

    if (createDto.concepto.length > 500) {
      throw new BadRequestException('El concepto no puede exceder 500 caracteres');
    }

    if (createDto.monto > 1000000) {
      throw new BadRequestException('El monto no puede exceder $1,000,000');
    }

    if (!createDto.integrantes || createDto.integrantes.length === 0) {
      throw new BadRequestException('Debe incluir al menos un integrante');
    }

    // Validación básica sin enums
    if (![2, 3, 4, 5, 6, 7, 9].includes(createDto.tipoSolicitudId)) {
      throw new BadRequestException('Tipo de solicitud inválido. Valores permitidos: 2, 3, 4, 5, 6, 7, 9');
    }

    if (![1, 2, 3, 4, 5, 6, 7, 9].includes(createDto.tipoPagoId)) {
      throw new BadRequestException('Tipo de pago inválido. Valores permitidos: 1, 2, 3, 4, 5, 6, 7, 9');
    }

    if (![1, 2, 3, 4].includes(createDto.divisionId)) {
      throw new BadRequestException('División inválida. Valores permitidos: 1, 2, 3, 4');
    }
  }

  async findAll(currentUser: IUserPayload) {
    const user = await this.usersService.findOne(currentUser.sub);
    const authorizedRoles = ['Admin', 'Administrator'];
    const isAdmin = authorizedRoles.includes(currentUser.role);
    
    let whereCondition = {};
    if (!isAdmin) {
      whereCondition = { usuarioId: currentUser.sub };
    }

    return await this.solicitudRepository.find({
      where: whereCondition,
      relations: ['integrantes'],
      order: { fechaOrden: 'DESC' }
    });
  }

  async findOne(id: number, currentUser: IUserPayload) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: ['integrantes']
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const user = await this.usersService.findOne(currentUser.sub);
    const authorizedRoles = ['Admin', 'Administrator'];
    const isAdmin = authorizedRoles.includes(currentUser.role);
    
    if (!isAdmin && solicitud.usuarioId !== currentUser.sub) {
      throw new UnauthorizedException('No tienes permisos para ver esta solicitud');
    }

    return solicitud;
  }

  async update(id: number, updateDto: any, currentUser: IUserPayload) {
    const solicitud = await this.findOne(id, currentUser);
    
    const user = await this.usersService.findOne(currentUser.sub);
    const authorizedRoles = ['Admin', 'Administrator'];
    const isAdmin = authorizedRoles.includes(currentUser.role);
    
    if (!isAdmin && solicitud.usuarioId !== currentUser.sub) {
      throw new UnauthorizedException('No tienes permisos para actualizar esta solicitud');
    }

    this.validateBusinessRules(updateDto);

    const updatedSolicitud = await this.solicitudRepository.save({
      ...solicitud,
      ...updateDto,
      updatedBy: currentUser.sub,
      updatedAt: new Date()
    });

    this.logger.log(`Solicitud ${id} actualizada por usuario ${currentUser.sub}`);

    return updatedSolicitud;
  }

  async remove(id: number, currentUser: IUserPayload) {
    const user = await this.usersService.findOne(currentUser.sub);
    const authorizedRoles = ['Admin', 'Administrator'];
    const isAdmin = authorizedRoles.includes(currentUser.role);
    
    if (!isAdmin) {
      throw new UnauthorizedException('Solo administradores pueden eliminar solicitudes');
    }

    const solicitud = await this.findOne(id, currentUser);
    
    await this.solicitudRepository.save({
      ...solicitud,
      deletedBy: currentUser.sub,
      deletedAt: new Date(),
      statusId: 4
    });

    this.logger.log(`Solicitud ${id} eliminada por usuario ${currentUser.sub}`);

    return { mensaje: 'Solicitud eliminada exitosamente' };
  }
}