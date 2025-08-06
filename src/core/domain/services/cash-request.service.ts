import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ICashRequestService } from '../cash-request.service.interface';
import { ICashRequestResponse, ICashRequestFilters, ICashRequestStats, CashRequestStatus } from '../cash-request.interface';
import { UserRole } from '../user.interface';
import { ICashRequestRepository, ICashRequestWriteRepository } from '../repositories/cash-request.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { SolicitudGeneralWriteRepository } from '../../../infrastructure/repositories/solicitud-general-write.repository';

@Injectable()
export class CashRequestService implements ICashRequestService {
  constructor(
    @Inject('ICashRequestRepository')
    private readonly cashRequestRepository: ICashRequestRepository,
    @Inject('ICashRequestWriteRepository')
    private readonly cashRequestWriteRepository: ICashRequestWriteRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly solicitudGeneralWriteRepository: SolicitudGeneralWriteRepository,
  ) {}

  async findAll(): Promise<ICashRequestResponse[]> {
    try {
      console.log('Iniciando findAll en CashRequestService');
      const cashRequests = await this.cashRequestRepository.findAll();
      console.log(`Encontradas ${cashRequests.length} solicitudes de efectivo`);
      return await this.enrichWithUserData(cashRequests);
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<ICashRequestResponse | null> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) {
      // Si no se encuentra en la vista final, intentar obtener desde la tabla base
      console.warn(`Solicitud ${id} no encontrada en la vista final. Intentando obtener desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        return null;
      }
      
      // Crear una respuesta básica con los datos de la tabla base
      const basicResponse = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitada_porid_user: null, // Se llenará en enrichWithUserData
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        autorizado_porid_user: null, // Se llenará en enrichWithUserData
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
      
      const enrichedRequests = await this.enrichWithUserData([basicResponse]);
      return enrichedRequests[0];
    }

    const enrichedRequests = await this.enrichWithUserData([cashRequest]);
    return enrichedRequests[0];
  }

  async findByUser(userId: number): Promise<ICashRequestResponse[]> {
    const cashRequests = await this.cashRequestRepository.findByUser(userId);
    return await this.enrichWithUserData(cashRequests);
  }

  async findByFilters(filters: ICashRequestFilters): Promise<ICashRequestResponse[]> {
    const cashRequests = await this.cashRequestRepository.findByFilters(filters);
    return await this.enrichWithUserData(cashRequests);
  }

  async getStats(): Promise<ICashRequestStats> {
    return await this.cashRequestRepository.getStats();
  }

  async create(
    cashRequestData: any,
    currentUser: { sub: number; role: UserRole }
  ): Promise<ICashRequestResponse> {
         // Validar que el usuario existe
     const user = await this.userRepository.findById(currentUser.sub);
     if (!user) {
       throw new BadRequestException('Usuario no encontrado');
     }

     // Generar número de solicitud
     const solicitudNumero = await this.solicitudGeneralWriteRepository.getNextSolicitudNumber();

     // Crear la solicitud en la tabla base
     const newSolicitud = await this.solicitudGeneralWriteRepository.create({
       fechacreada: new Date(),
       solicitada_porid: currentUser.sub,
       monto_solicitado: cashRequestData.monto_solicitado,
       solicitud_tipo: cashRequestData.solicitud_tipo,
       divicionid: cashRequestData.divicionid,
       tipo_pago: cashRequestData.tipo_pago,
       solicitud_status: CashRequestStatus.PENDING,
       concepto: cashRequestData.concepto || '',
       fecha_requerida: cashRequestData.fecha_requerida,
       solicitud_numero: solicitudNumero,
       departamento: cashRequestData.departamento || '',
       nombre_cliente: cashRequestData.nombre_cliente || '',
       num_orden_prod: cashRequestData.num_orden_prod || '',
       num_ticket_prod: cashRequestData.num_ticket_prod || '',
     });

         // Devolver la solicitud creada directamente
     const enrichedRequests = await this.enrichWithUserData([newSolicitud]);
     return enrichedRequests[0];
  }

  async update(
    id: number,
    cashRequestData: any,
    currentUser: { sub: number; role: UserRole }
  ): Promise<ICashRequestResponse> {
    // Primero intentar obtener desde la vista final
    let existingCashRequest = await this.cashRequestRepository.findById(id);
    
    // Si no se encuentra en la vista final, intentar obtener desde la tabla base
    if (!existingCashRequest) {
      console.warn(`Solicitud ${id} no encontrada en la vista final. Intentando obtener desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new NotFoundException('Solicitud de efectivo no encontrada');
      }
      
      // Crear un objeto compatible con la estructura esperada para validaciones
      existingCashRequest = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
    }

    // Validar permisos: solo el solicitante o un admin puede editar
    if (existingCashRequest.solicitada_porid !== currentUser.sub && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('No tienes permisos para editar esta solicitud');
    }

    // No permitir editar solicitudes ya aprobadas o rechazadas
    if (existingCashRequest.solicitud_status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('No se puede editar una solicitud que ya fue procesada');
    }

    // Actualizar la solicitud en la tabla base
    const updatedSolicitud = await this.solicitudGeneralWriteRepository.update(id, {
      monto_solicitado: cashRequestData.monto_solicitado,
      solicitud_tipo: cashRequestData.solicitud_tipo,
      divicionid: cashRequestData.divicionid,
      tipo_pago: cashRequestData.tipo_pago,
      concepto: cashRequestData.concepto,
      fecha_requerida: cashRequestData.fecha_requerida,
      departamento: cashRequestData.departamento,
      nombre_cliente: cashRequestData.nombre_cliente,
      num_orden_prod: cashRequestData.num_orden_prod,
      num_ticket_prod: cashRequestData.num_ticket_prod,
    });

    // Obtener la solicitud actualizada desde la vista
    const enrichedSolicitud = await this.cashRequestRepository.findById(id);
    if (!enrichedSolicitud) {
      // Si no se encuentra en la vista final, intentar obtener desde la tabla base
      console.warn(`Solicitud ${id} no encontrada en la vista final después de actualización. Obteniendo desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new Error('Error al obtener la solicitud actualizada');
      }
      
      // Crear una respuesta básica con los datos de la tabla base
      const basicResponse = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitada_porid_user: null, // Se llenará en enrichWithUserData
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        autorizado_porid_user: null, // Se llenará en enrichWithUserData
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
      
      const enrichedRequests = await this.enrichWithUserData([basicResponse]);
      return enrichedRequests[0];
    }

    const enrichedRequests = await this.enrichWithUserData([enrichedSolicitud]);
    return enrichedRequests[0];
  }

  async approve(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    // Solo admins pueden aprobar
    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Solo los administradores pueden aprobar solicitudes');
    }

    // Primero intentar obtener desde la vista final
    let existingCashRequest = await this.cashRequestRepository.findById(id);
    
    // Si no se encuentra en la vista final, intentar obtener desde la tabla base
    if (!existingCashRequest) {
      console.warn(`Solicitud ${id} no encontrada en la vista final. Intentando obtener desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new NotFoundException('Solicitud de efectivo no encontrada');
      }
      
      // Crear un objeto compatible con la estructura esperada para validaciones
      existingCashRequest = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
    }

    if (existingCashRequest.solicitud_status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
    }

    // Aprobar la solicitud en la tabla base
    const updatedSolicitud = await this.solicitudGeneralWriteRepository.update(id, {
      solicitud_status: CashRequestStatus.APPROVED,
      autorizado_porid: currentUser.sub,
      concepto: notes || existingCashRequest.concepto,
    });

    // Obtener la solicitud actualizada desde la vista
    const enrichedSolicitud = await this.cashRequestRepository.findById(id);
    if (!enrichedSolicitud) {
      // Si no se encuentra en la vista final después de actualizar, obtener desde tabla base
      console.warn(`Solicitud ${id} no encontrada en la vista final después de aprobación. Obteniendo desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new Error('Error al obtener la solicitud aprobada');
      }
      
      // Crear una respuesta básica con los datos de la tabla base
      const basicResponse = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitada_porid_user: null, // Se llenará en enrichWithUserData
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        autorizado_porid_user: null, // Se llenará en enrichWithUserData
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
      
      const enrichedRequests = await this.enrichWithUserData([basicResponse]);
      return enrichedRequests[0];
    }

    const enrichedRequests = await this.enrichWithUserData([enrichedSolicitud]);
    return enrichedRequests[0];
  }

  async reject(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    // Solo admins pueden rechazar
    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Solo los administradores pueden rechazar solicitudes');
    }

    // Primero intentar obtener desde la vista final
    let existingCashRequest = await this.cashRequestRepository.findById(id);
    
    // Si no se encuentra en la vista final, intentar obtener desde la tabla base
    if (!existingCashRequest) {
      console.warn(`Solicitud ${id} no encontrada en la vista final. Intentando obtener desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new NotFoundException('Solicitud de efectivo no encontrada');
      }
      
      // Crear un objeto compatible con la estructura esperada para validaciones
      existingCashRequest = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
    }

    if (existingCashRequest.solicitud_status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('Solo se pueden rechazar solicitudes pendientes');
    }

    // Rechazar la solicitud en la tabla base
    const updatedSolicitud = await this.solicitudGeneralWriteRepository.update(id, {
      solicitud_status: CashRequestStatus.REJECTED,
      autorizado_porid: currentUser.sub,
      razon_rechazon: notes || existingCashRequest.razon_rechazon,
      fecha_rechazada: new Date(),
    });

    // Obtener la solicitud actualizada desde la vista
    const enrichedSolicitud = await this.cashRequestRepository.findById(id);
    if (!enrichedSolicitud) {
      // Si no se encuentra en la vista final después de actualizar, obtener desde tabla base
      console.warn(`Solicitud ${id} no encontrada en la vista final después de rechazo. Obteniendo desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new Error('Error al obtener la solicitud rechazada');
      }
      
      // Crear una respuesta básica con los datos de la tabla base
      const basicResponse = {
        id: baseSolicitud.id,
        fechacreada: baseSolicitud.fechacreada,
        solicitada_porid: baseSolicitud.solicitada_porid,
        solicitada_porid_user: null, // Se llenará en enrichWithUserData
        solicitud_tipo: baseSolicitud.solicitud_tipo,
        solicitud_status: baseSolicitud.solicitud_status,
        autorizado_porid: baseSolicitud.autorizado_porid,
        autorizado_porid_user: null, // Se llenará en enrichWithUserData
        monto_solicitado: Number(baseSolicitud.monto_solicitado),
        fecha_requerida: baseSolicitud.fecha_requerida,
        divicionid: baseSolicitud.divicionid,
        departamento: baseSolicitud.departamento,
        concepto: baseSolicitud.concepto,
        fecha_orden_prod: baseSolicitud.fecha_orden_prod,
        num_orden_prod: baseSolicitud.num_orden_prod,
        num_ticket_prod: baseSolicitud.num_ticket_prod,
        nombre_cliente: baseSolicitud.nombre_cliente,
        solicitud_numero: baseSolicitud.solicitud_numero,
        fecha_rechazada: baseSolicitud.fecha_rechazada,
        tipo_pago: baseSolicitud.tipo_pago,
        razon_rechazon: baseSolicitud.razon_rechazon,
        usuarionombre: null,
        autorizadopor_nombre: null,
        cedula: null,
        division_nombre: null,
        estatus_desc: null,
        estatus_icon: null,
        solicitud_tipo_desc: null,
        produccion: 0,
        tipo_pago_desc: null,
        verificadopor_nombre: null,
      };
      
      const enrichedRequests = await this.enrichWithUserData([basicResponse]);
      return enrichedRequests[0];
    }

    const enrichedRequests = await this.enrichWithUserData([enrichedSolicitud]);
    return enrichedRequests[0];
  }

  async remove(
    id: number,
    currentUser: { sub: number; role: UserRole },
    confirmPermanentDelete?: boolean,
    reason?: string
  ): Promise<{ message: string; type: 'soft' | 'permanent'; cashRequest: any }> {
    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      // Si no se encuentra en la vista final, intentar obtener desde la tabla base
      console.warn(`Solicitud ${id} no encontrada en la vista final. Intentando obtener desde tabla base.`);
      
      const baseSolicitud = await this.solicitudGeneralWriteRepository.findById(id);
      if (!baseSolicitud) {
        throw new NotFoundException('Solicitud de efectivo no encontrada');
      }
      
      // Validar permisos usando los datos de la tabla base
      if (baseSolicitud.solicitada_porid !== currentUser.sub && currentUser.role !== UserRole.Admin) {
        throw new ForbiddenException('No tienes permisos para eliminar esta solicitud');
      }

      // Validar eliminación usando los datos de la tabla base
      this.validateCashRequestDeletion(baseSolicitud, currentUser, confirmPermanentDelete);

      if (confirmPermanentDelete) {
        // Eliminación permanente en la tabla base
        await this.solicitudGeneralWriteRepository.delete(id);
        return {
          message: 'Solicitud de efectivo eliminada permanentemente',
          type: 'permanent',
          cashRequest: { id, deletedBy: currentUser.sub, reason }
        };
      } else {
        // Soft delete - marcar como cancelada
        await this.solicitudGeneralWriteRepository.update(id, {
          solicitud_status: CashRequestStatus.CANCELLED,
          razon_rechazon: reason || 'Eliminada por el usuario',
        });
        
        return {
          message: 'Solicitud marcada como cancelada',
          type: 'soft',
          cashRequest: { id, cancelledBy: currentUser.sub, reason }
        };
      }
    }

    // Validar permisos
    if (existingCashRequest.solicitada_porid !== currentUser.sub && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('No tienes permisos para eliminar esta solicitud');
    }

    // Validar eliminación
    this.validateCashRequestDeletion(existingCashRequest, currentUser, confirmPermanentDelete);

    if (confirmPermanentDelete) {
      // Eliminación permanente en la tabla base
      await this.solicitudGeneralWriteRepository.delete(id);
      return {
        message: 'Solicitud de efectivo eliminada permanentemente',
        type: 'permanent',
        cashRequest: { id, deletedBy: currentUser.sub, reason }
      };
    } else {
      // Soft delete - marcar como cancelada
      await this.solicitudGeneralWriteRepository.update(id, {
        solicitud_status: CashRequestStatus.CANCELLED,
        razon_rechazon: reason || 'Eliminada por el usuario',
      });
      
      return {
        message: 'Solicitud marcada como cancelada',
        type: 'soft',
        cashRequest: { id, cancelledBy: currentUser.sub, reason }
      };
    }
  }

  async restore(
    id: number,
    currentUser: { sub: number; role: UserRole }
  ): Promise<{ message: string; cashRequest: any }> {
    throw new BadRequestException(
      'No se pueden restaurar solicitudes de efectivo directamente. ' +
      'La vista vsolicitud_generales no es actualizable porque afecta múltiples tablas base. ' +
      'Por favor, contacte al administrador del sistema para restaurar solicitudes.'
    );
  }

  async findDeleted(): Promise<ICashRequestResponse[]> {
    // Como es una vista, no podemos obtener registros eliminados
    throw new BadRequestException('No se puede obtener registros eliminados de una vista.');
  }

  private validateCashRequestDeletion(
    cashRequest: any,
    currentUser: { sub: number; role: UserRole },
    confirmPermanentDelete?: boolean
  ): void {
    if (confirmPermanentDelete && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Solo los administradores pueden eliminar permanentemente');
    }

    // Verificar si el status es APPROVED (2) - tanto para datos de vista como de tabla base
    const status = cashRequest.solicitud_status || cashRequest.solicitud_status;
    if (status === CashRequestStatus.APPROVED || status === 2) {
      throw new BadRequestException('No se puede eliminar una solicitud aprobada');
    }
  }

  private async enrichWithUserData(cashRequests: any[]): Promise<ICashRequestResponse[]> {
    try {
      const userIds = new Set<number>();
      
      // Recolectar todos los IDs de usuarios únicos
      cashRequests.forEach(cashRequest => {
        if (cashRequest.solicitada_porid) {
          userIds.add(cashRequest.solicitada_porid);
        }
        if (cashRequest.autorizado_porid) {
          userIds.add(cashRequest.autorizado_porid);
        }
      });

      // Obtener información de usuarios
      const users = await Promise.all(
        Array.from(userIds).map(async (id) => {
          try {
            return await this.userRepository.findById(id);
          } catch (error) {
            console.error(`Error obteniendo usuario con ID ${id}:`, error);
            return null;
          }
        })
      );

      const userMap = new Map();
      users.forEach(user => {
        if (user) {
          userMap.set(user.id, {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            cedula: user.cedula,
          });
        }
      });

      // Enriquecer las solicitudes con información de usuarios
      return cashRequests.map(cashRequest => ({
        id: cashRequest.id,
        fechacreada: cashRequest.fechacreada,
        solicitada_porid: cashRequest.solicitada_porid,
        solicitada_porid_user: cashRequest.solicitada_porid ? userMap.get(cashRequest.solicitada_porid) : null,
        solicitud_tipo: cashRequest.solicitud_tipo,
        solicitud_status: cashRequest.solicitud_status,
        autorizado_porid: cashRequest.autorizado_porid,
        autorizado_porid_user: cashRequest.autorizado_porid ? userMap.get(cashRequest.autorizado_porid) : null,
        monto_solicitado: Number(cashRequest.monto_solicitado),
        fecha_requerida: cashRequest.fecha_requerida,
        divicionid: cashRequest.divicionid,
        departamento: cashRequest.departamento,
        concepto: cashRequest.concepto,
        fecha_orden_prod: cashRequest.fecha_orden_prod,
        num_orden_prod: cashRequest.num_orden_prod,
        num_ticket_prod: cashRequest.num_ticket_prod,
        nombre_cliente: cashRequest.nombre_cliente,
        solicitud_numero: cashRequest.solicitud_numero,
        fecha_rechazada: cashRequest.fecha_rechazada,
        tipo_pago: cashRequest.tipo_pago,
        razon_rechazon: cashRequest.razon_rechazon,
        usuarionombre: cashRequest.usuarionombre,
        autorizadopor_nombre: cashRequest.autorizadopor_nombre,
        cedula: cashRequest.cedula,
        division_nombre: cashRequest.division_nombre,
        estatus_desc: cashRequest.estatus_desc,
        estatus_icon: cashRequest.estatus_icon,
        solicitud_tipo_desc: cashRequest.solicitud_tipo_desc,
        produccion: cashRequest.produccion,
        tipo_pago_desc: cashRequest.tipo_pago_desc,
        verificadopor_nombre: cashRequest.verificadopor_nombre,
      }));
    } catch (error) {
      console.error('Error en enrichWithUserData:', error);
      throw error;
    }
  }
} 
