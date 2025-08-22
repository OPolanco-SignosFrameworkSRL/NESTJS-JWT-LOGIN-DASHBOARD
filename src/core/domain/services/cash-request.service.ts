import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ICashRequestService } from '../cash-request.service.interface';
import { ICashRequestResponse, ICashRequestFilters, ICashRequestStats, CashRequestStatus } from '../interfaces/cash-request.interface';
import { UserRole } from '../interfaces/user.interface';
import { ICashRequestRepository } from '../repositories/cash-request.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { USER_REPOSITORY, CASH_REQUEST_REPOSITORY } from '../../application/tokens';
import { CashRequest } from '../entities/cash-request.entity';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class CashRequestService implements ICashRequestService {
  constructor(
    @Inject(CASH_REQUEST_REPOSITORY)
    private readonly cashRequestRepository: ICashRequestRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(filters?: ICashRequestFilters): Promise<PaginatedResponseDto<ICashRequestResponse>> {
    try {
      const { page = 1, limit = 10, ...otherFilters } = filters || {};
      const skip = (page - 1) * limit;

      console.log('Iniciando findAll en CashRequestService');
      
      // Obtener solicitudes con paginación
      const [cashRequests, total] = await this.cashRequestRepository.findAllWithPagination(
        { ...otherFilters, skip, take: limit }
      );
      
      console.log(`Encontradas ${cashRequests.length} solicitudes de efectivo de ${total} total`);
      
      const enrichedRequests = await this.enrichWithUserData(cashRequests);
      const totalPages = Math.ceil(total / limit);

      return {
        data: enrichedRequests,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<ICashRequestResponse | null> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) {
      return null;
    }

    const enrichedRequests = await this.enrichWithUserData([cashRequest]);
    return enrichedRequests[0];
  }

  async findByUser(userId: number): Promise<ICashRequestResponse[]> {
    const cashRequests = await this.cashRequestRepository.findByUserId(userId);
    return await this.enrichWithUserData(cashRequests);
  }

  async findByFilters(filters: ICashRequestFilters): Promise<ICashRequestResponse[]> {
    const cashRequests = await this.cashRequestRepository.findAll(filters);
    return await this.enrichWithUserData(cashRequests);
  }

  /**
   * Obtiene solo las solicitudes pendientes de aprobación
   */
  async findPendingRequests(): Promise<ICashRequestResponse[]> {
    const pendingRequests = await this.cashRequestRepository.findByStatus(CashRequestStatus.PENDIENTE);
    return await this.enrichWithUserData(pendingRequests);
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

    // Validar que el monto sea válido
    if (!cashRequestData.monto_solicitado || cashRequestData.monto_solicitado <= 0) {
      throw new BadRequestException('El monto solicitado debe ser mayor a 0');
    }

    // Validar que el concepto no esté vacío
    if (!cashRequestData.concepto || cashRequestData.concepto.trim() === '') {
      throw new BadRequestException('El concepto de la solicitud es obligatorio');
    }

    // Crear la solicitud usando el repositorio - SIEMPRE en estado PENDIENTE
    const newCashRequest = await this.cashRequestRepository.create({
      ...cashRequestData,
      solicitada_porid: currentUser.sub,
      solicitud_status: CashRequestStatus.PENDIENTE, // Estado por defecto
      fechacreada: new Date(),
      autorizado_porid: null, // No autorizado inicialmente
      fecha_rechazada: null, // No rechazada inicialmente
      razon_rechazon: null, // Sin razón de rechazo inicialmente
    });

    const enrichedRequests = await this.enrichWithUserData([newCashRequest]);
    return enrichedRequests[0];
  }

  async update(
    id: number,
    cashRequestData: any,
    currentUser: { sub: number; role: UserRole }
  ): Promise<ICashRequestResponse> {
    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos: solo el solicitante o un admin puede editar
    if (existingCashRequest.solicitada_porid !== currentUser.sub && currentUser.role !== 'Admin') {
      throw new ForbiddenException('No tienes permisos para editar esta solicitud');
    }

    // No permitir editar solicitudes ya aprobadas o rechazadas
    if (existingCashRequest.solicitud_status !== CashRequestStatus.PENDIENTE) {
      throw new BadRequestException('No se puede editar una solicitud que ya fue procesada');
    }

    // Actualizar la solicitud
    const updatedCashRequest = await this.cashRequestRepository.update(id, cashRequestData);
    const enrichedRequests = await this.enrichWithUserData([updatedCashRequest]);
    return enrichedRequests[0];
  }

  async approve(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos: solo usuarios autorizados pueden aprobar
    if (!this.isUserAuthorizedToApprove(currentUser.role)) {
      throw new ForbiddenException('No tienes permisos para aprobar solicitudes de efectivo');
    }

    // No permitir aprobar solicitudes ya procesadas
    if (cashRequest.solicitud_status !== CashRequestStatus.PENDIENTE) {
      throw new BadRequestException('Solo se pueden aprobar solicitudes en estado PENDIENTE');
    }

    // Validar que el usuario que aprueba no sea el mismo que solicitó
    if (cashRequest.solicitada_porid === currentUser.sub) {
      throw new ForbiddenException('No puedes aprobar tu propia solicitud de efectivo');
    }

    // Aprobar la solicitud usando el nuevo método updateStatus
    const approvedCashRequest = await this.cashRequestRepository.updateStatus(
      id, 
      2, // APROBADA
      currentUser.sub, 
      'approve', 
      notes
    );
    const enrichedRequests = await this.enrichWithUserData([approvedCashRequest]);
    return enrichedRequests[0];
  }

  async reject(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos: solo usuarios autorizados pueden rechazar
    if (!this.isUserAuthorizedToApprove(currentUser.role)) {
      throw new ForbiddenException('No tienes permisos para rechazar solicitudes de efectivo');
    }

    // No permitir rechazar solicitudes ya procesadas
    if (cashRequest.solicitud_status !== CashRequestStatus.PENDIENTE) {
      throw new BadRequestException('Solo se pueden rechazar solicitudes en estado PENDIENTE');
    }

    // Validar que el usuario que rechaza no sea el mismo que solicitó
    if (cashRequest.solicitada_porid === currentUser.sub) {
      throw new ForbiddenException('No puedes rechazar tu propia solicitud de efectivo');
    }

    // Validar que se proporcione una razón para el rechazo
    if (!notes || notes.trim() === '') {
      throw new BadRequestException('Es obligatorio proporcionar una razón para rechazar la solicitud');
    }

    // Rechazar la solicitud usando el nuevo método updateStatus
    const rejectedCashRequest = await this.cashRequestRepository.updateStatus(
      id, 
      4, // RECHAZADA
      currentUser.sub, 
      'reject', 
      notes
    );
    const enrichedRequests = await this.enrichWithUserData([rejectedCashRequest]);
    return enrichedRequests[0];
  }

  async remove(
    id: number,
    currentUser: { sub: number; role: UserRole },
    confirmPermanentDelete?: boolean,
    reason?: string
  ): Promise<{ message: string; type: 'soft' | 'permanent'; cashRequest: any }> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos
    if (cashRequest.solicitada_porid !== currentUser.sub && currentUser.role !== 'Admin') {
      throw new ForbiddenException('No tienes permisos para eliminar esta solicitud');
    }

    // Eliminar la solicitud
    await this.cashRequestRepository.delete(id);

    return {
      message: 'Solicitud eliminada exitosamente',
      type: 'permanent',
      cashRequest: cashRequest,
    };
  }

  async restore(
    id: number,
    currentUser: { sub: number; role: UserRole }
  ): Promise<{ message: string; cashRequest: any }> {
    // Validar permisos: solo admins pueden restaurar
    if (currentUser.role !== 'Admin') {
      throw new ForbiddenException('Solo los administradores pueden restaurar solicitudes');
    }

    const restoredCashRequest = await this.cashRequestRepository.restore(id);
    if (!restoredCashRequest) {
      throw new NotFoundException('Solicitud no encontrada o no se pudo restaurar');
    }

    return {
      message: 'Solicitud restaurada exitosamente',
      cashRequest: restoredCashRequest,
    };
  }

  async findDeleted(): Promise<ICashRequestResponse[]> {
    const deletedCashRequests = await this.cashRequestRepository.findDeleted();
    return await this.enrichWithUserData(deletedCashRequests);
  }

  private async enrichWithUserData(cashRequests: CashRequest[]): Promise<ICashRequestResponse[]> {
    const enrichedRequests: ICashRequestResponse[] = [];

    for (const cashRequest of cashRequests) {
      // Obtener datos del usuario solicitante
      const user = await this.userRepository.findById(cashRequest.solicitada_porid);
      
      // Obtener datos del usuario autorizador si existe
      let autorizador = null;
      if (cashRequest.autorizado_porid) {
        autorizador = await this.userRepository.findById(cashRequest.autorizado_porid);
      }

      const enrichedRequest: ICashRequestResponse = {
        id: cashRequest.id,
        fechacreada: cashRequest.fechacreada,
        solicitada_porid: cashRequest.solicitada_porid,
        solicitud_tipo: cashRequest.solicitud_tipo,
        solicitud_status: cashRequest.solicitud_status,
        monto_solicitado: cashRequest.monto_solicitado,
        concepto: cashRequest.concepto,
        divicionid: cashRequest.divicionid,
        tipo_pago: cashRequest.tipo_pago,
        autorizado_porid: cashRequest.autorizado_porid,
        fecha_requerida: cashRequest.fecha_requerida,
        departamento: cashRequest.departamento,
        fecha_orden_prod: cashRequest.fecha_orden_prod,
        num_orden_prod: cashRequest.num_orden_prod,
        num_ticket_prod: cashRequest.num_ticket_prod,
        nombre_cliente: cashRequest.nombre_cliente,
        solicitud_numero: cashRequest.solicitud_numero,
        fecha_rechazada: cashRequest.fecha_rechazada,
        razon_rechazon: cashRequest.razon_rechazon,
        produccion: cashRequest.produccion,
        usuarionombre: user?.nombre ? `${user.nombre} ${user.apellido}` : 'Usuario no encontrado',
        autorizadopor_nombre: autorizador?.nombre ? `${autorizador.nombre} ${autorizador.apellido}` : undefined,
        cedula: user?.cedula,
        division_nombre: `División ${cashRequest.divicionid}`,
        estatus_desc: this.getStatusDescription(cashRequest.solicitud_status),
        estatus_icon: this.getStatusIcon(cashRequest.solicitud_status),
        solicitud_tipo_desc: this.getTypeDescription(cashRequest.solicitud_tipo),
        tipo_pago_desc: this.getPaymentTypeDescription(cashRequest.tipo_pago),
        verificadopor_nombre: autorizador?.nombre ? `${autorizador.nombre} ${autorizador.apellido}` : undefined,
      };

      enrichedRequests.push(enrichedRequest);
    }

    return enrichedRequests;
  }

  private getStatusDescription(status: CashRequestStatus): string {
    switch (status) {
      case CashRequestStatus.PENDIENTE:
        return 'Pendiente';
      case CashRequestStatus.APROBADA:
        return 'Aprobada';
      case CashRequestStatus.AUTORIZADO:
        return 'Autorizado';
      case CashRequestStatus.RECHAZADA:
        return 'Rechazada';
      case CashRequestStatus.DESEMBOLSADO:
        return 'Desembolsado';
      default:
        return 'Desconocido';
    }
  }

  private getStatusIcon(status: CashRequestStatus): string {
    switch (status) {
      case CashRequestStatus.APROBADA:
        return '✅';
      case CashRequestStatus.RECHAZADA:
        return '❌';
      case CashRequestStatus.DESEMBOLSADO:
        return '💰';
      case CashRequestStatus.PENDIENTE:
        return '⏳';
      default:
        return '❓';
    }
  }

  private getTypeDescription(type: number): string {
    switch (type) {
      case 1:
        return 'Compra de Materiales';
      case 2:
        return 'Reembolso';
      case 8:
        return 'Otros';
      default:
        return 'Desconocido';
    }
  }

  private getPaymentTypeDescription(paymentType: number): string {
    switch (paymentType) {
      case 1:
        return 'Efectivo';
      case 2:
        return 'Transferencia';
      case 3:
        return 'Cheque';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Verifica si un usuario tiene permisos para aprobar solicitudes de efectivo
   */
  private isUserAuthorizedToApprove(userRole: UserRole): boolean {
    // Roles autorizados para aprobar solicitudes de efectivo
    const authorizedRoles: UserRole[] = ['Admin', 'Administrator', 'Manager', 'Supervisor'];
    return authorizedRoles.includes(userRole);
  }
} 
