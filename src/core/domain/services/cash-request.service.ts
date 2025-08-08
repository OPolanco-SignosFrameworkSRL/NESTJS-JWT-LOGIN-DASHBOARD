import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ICashRequestService } from '../cash-request.service.interface';
import { ICashRequestResponse, ICashRequestFilters, ICashRequestStats, CashRequestStatus } from '../interfaces/cash-request.interface';
import { UserRole } from '../interfaces/user.interface';
import { ICashRequestRepository } from '../repositories/cash-request.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
import { CashRequest } from '../entities/cash-request.entity';
import { CASH_REQUEST_REPOSITORY, USER_REPOSITORY } from '../../application/application.module';

@Injectable()
export class CashRequestService implements ICashRequestService {
  constructor(
    @Inject(CASH_REQUEST_REPOSITORY)
    private readonly cashRequestRepository: ICashRequestRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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

    // Crear la solicitud usando el repositorio
    const newCashRequest = await this.cashRequestRepository.create({
      ...cashRequestData,
      solicitada_porid: currentUser.sub,
      solicitud_status: CashRequestStatus.PENDIENTE,
      fechacreada: new Date(),
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

    // Validar permisos: solo admins pueden aprobar
    if (currentUser.role !== 'Admin') {
      throw new ForbiddenException('Solo los administradores pueden aprobar solicitudes');
    }

    // No permitir aprobar solicitudes ya procesadas
    if (cashRequest.solicitud_status !== CashRequestStatus.PENDIENTE) {
      throw new BadRequestException('La solicitud ya fue procesada');
    }

    // Aprobar la solicitud
    const approvedCashRequest = await this.cashRequestRepository.approve(id, currentUser.sub);
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

    // Validar permisos: solo admins pueden rechazar
    if (currentUser.role !== 'Admin') {
      throw new ForbiddenException('Solo los administradores pueden rechazar solicitudes');
    }

    // No permitir rechazar solicitudes ya procesadas
    if (cashRequest.solicitud_status !== CashRequestStatus.PENDIENTE) {
      throw new BadRequestException('La solicitud ya fue procesada');
    }

    // Rechazar la solicitud
    const rejectedCashRequest = await this.cashRequestRepository.reject(id, currentUser.sub, notes || 'Rechazada por administrador');
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
      case CashRequestStatus.RECHAZADA:
        return 'Rechazada';
      case CashRequestStatus.LIQUIDADA:
        return 'Liquidada';
      case CashRequestStatus.EN_PROCESO:
        return 'En Proceso';
      case CashRequestStatus.DEFINITIVO:
        return 'Definitivo';
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
      case CashRequestStatus.LIQUIDADA:
        return '💰';
      case CashRequestStatus.EN_PROCESO:
        return '🔄';
      case CashRequestStatus.DEFINITIVO:
        return '🏁';
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
} 
