import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SolicitudEfectivoEntity } from '../../../infrastructure/database/entities/solicitud-efectivo.entity';
import { IntegranteDesembolsoEntity } from '../../../infrastructure/database/entities/integrante-desembolso.entity';
import { UsersService } from './users.service';
import { IUserPayload } from '../interfaces/user.interface';
import { CreateSolicitudDto } from '../../application/dto/create-solicitud.dto';
import { SolicitudEfectivoStatus, SolicitudEfectivoType, Division } from '../interfaces/solicitud-efectivo.interface';
import { SolicitudTipoEntity } from '../../../infrastructure/database/entities/solicitud-tipo.entity';
import { TipoPagoEntity } from '../../../infrastructure/database/entities/tipo-pago.entity';
import { DivisionEntity } from '../../../infrastructure/database/entities/division.entity';
import { PaginationDto } from '../../application/dto/pagination.dto';

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
    await this.validateBusinessRules(createDto);

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
  private async validateBusinessRules(createDto: CreateSolicitudDto): Promise<void> {
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

    // Validar contra BD (sin hardcode)
    const tipoSolicitudRepo = this.dataSource.getRepository(SolicitudTipoEntity);
    const existeTipoSolicitud = await tipoSolicitudRepo.exist({
      where: { id: createDto.tipoSolicitudId, produccionFlag: false },
    });
    if (!existeTipoSolicitud) {
      throw new BadRequestException('Tipo de solicitud inválido');
    }

    const tipoPagoRepo = this.dataSource.getRepository(TipoPagoEntity);
    const existeTipoPago = await tipoPagoRepo.exist({
      where: { pago_tipo: createDto.tipoPagoId },
    });
    if (!existeTipoPago) {
      throw new BadRequestException('Tipo de pago inválido');
    }

    const divisionRepo = this.dataSource.getRepository(DivisionEntity);
    const existeDivision = await divisionRepo.exist({
      where: { id: createDto.divisionId, estado: true },
    });
    if (!existeDivision) {
      throw new BadRequestException('División inválida');
    }
  }

  async findAll(currentUser: IUserPayload, pagination?: PaginationDto) {
    const user = await this.usersService.findOne(currentUser.sub);
    const authorizedRoles = ['Admin', 'Administrator'];
    const isAdmin = authorizedRoles.includes(currentUser.role);
    
    let whereCondition = {};
    if (!isAdmin) {
      whereCondition = { usuarioId: currentUser.sub };
    }

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.solicitudRepository.findAndCount({
      where: whereCondition,
      relations: ['integrantes', 'tipoSolicitud', 'division', 'tipoPago'],
      order: { fechaOrden: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    const sanitizedData = data.map(item => ({
      id: item.id,
      usuarioId: item.usuarioId,
      monto: item.monto,
      tipoSolicitudId: Number(item.tipoSolicitudId),
      tipoPagoId: Number(item.tipoPagoId),
      divisionId: Number(item.divisionId),
      fechaOrden: item.fechaOrden,
      numeroOrden: item.numeroOrden,
      nombreCliente: item.nombreCliente,
      numeroTicket: item.numeroTicket,
      concepto: item.concepto,
      statusId: item.statusId,
      integrantes: item.integrantes,
      tipoSolicitud: item.tipoSolicitud
        ? {
            id: item.tipoSolicitud.id,
            tipoDesc: item.tipoSolicitud.tipoDesc,
          }
        : null,
      division: item.division
        ? {
            id: item.division.id,
            nombre: item.division.nombre,
            dependenciaId: item.division.dependenciaId,
          }
        : null,
      tipoPago: item.tipoPago
        ? {
            pago_tipo: Number(item.tipoPago.pago_tipo),
            tipo_desc: item.tipoPago.tipo_desc,
          }
        : null,
    }));

    return {
      data: sanitizedData,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
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

    await this.validateBusinessRules(updateDto);

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