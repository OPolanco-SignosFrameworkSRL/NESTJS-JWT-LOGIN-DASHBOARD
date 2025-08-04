import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICashRequestService } from './cash-request.service.interface';
import { ICashRequestResponse, ICashRequestFilters, ICashRequestStats, CashRequestStatus } from '../cash-request.interface';
import { UserRole } from '../user.interface';
import { ICashRequestRepository, ICashRequestWriteRepository } from '../repositories/cash-request.repository.interface';
import { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class CashRequestService implements ICashRequestService {
  constructor(
    private readonly cashRequestRepository: ICashRequestRepository,
    private readonly cashRequestWriteRepository: ICashRequestWriteRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<ICashRequestResponse[]> {
    const cashRequests = await this.cashRequestRepository.findAll();
    return await this.enrichWithUserData(cashRequests);
  }

  async findById(id: number): Promise<ICashRequestResponse | null> {
    const cashRequest = await this.cashRequestRepository.findById(id);
    if (!cashRequest) return null;

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
    currentUser: { id: number; role: UserRole }
  ): Promise<ICashRequestResponse> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(currentUser.id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Crear la solicitud
    const newCashRequest = await this.cashRequestWriteRepository.create({
      requestedBy: currentUser.id,
      requestedAmount: cashRequestData.requestedAmount,
      requestType: cashRequestData.requestType,
      division: cashRequestData.division,
      paymentType: cashRequestData.paymentType,
      status: CashRequestStatus.PENDING,
      notes: cashRequestData.notes,
      valid: '1',
    });

    const enrichedRequests = await this.enrichWithUserData([newCashRequest]);
    return enrichedRequests[0];
  }

  async update(
    id: number,
    cashRequestData: any,
    currentUser: { id: number; role: UserRole }
  ): Promise<ICashRequestResponse> {
    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos: solo el solicitante o un admin puede editar
    if (existingCashRequest.requestedBy !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permisos para editar esta solicitud');
    }

    // No permitir editar solicitudes ya aprobadas o rechazadas
    if (existingCashRequest.status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('No se puede editar una solicitud que ya fue procesada');
    }

    // Actualizar la solicitud
    const updatedCashRequest = await this.cashRequestWriteRepository.update(id, {
      requestedAmount: cashRequestData.requestedAmount,
      requestType: cashRequestData.requestType,
      division: cashRequestData.division,
      paymentType: cashRequestData.paymentType,
      notes: cashRequestData.notes,
    });

    const enrichedRequests = await this.enrichWithUserData([updatedCashRequest]);
    return enrichedRequests[0];
  }

  async approve(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    // Solo admins pueden aprobar
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden aprobar solicitudes');
    }

    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    if (existingCashRequest.status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
    }

    // Aprobar la solicitud
    const updatedCashRequest = await this.cashRequestWriteRepository.update(id, {
      status: CashRequestStatus.APPROVED,
      approvedBy: currentUser.id,
      approvedAt: new Date(),
      notes: notes || existingCashRequest.notes,
    });

    const enrichedRequests = await this.enrichWithUserData([updatedCashRequest]);
    return enrichedRequests[0];
  }

  async reject(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse> {
    // Solo admins pueden rechazar
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden rechazar solicitudes');
    }

    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    if (existingCashRequest.status !== CashRequestStatus.PENDING) {
      throw new BadRequestException('Solo se pueden rechazar solicitudes pendientes');
    }

    // Rechazar la solicitud
    const updatedCashRequest = await this.cashRequestWriteRepository.update(id, {
      status: CashRequestStatus.REJECTED,
      approvedBy: currentUser.id,
      approvedAt: new Date(),
      notes: notes || existingCashRequest.notes,
    });

    const enrichedRequests = await this.enrichWithUserData([updatedCashRequest]);
    return enrichedRequests[0];
  }

  async remove(
    id: number,
    currentUser: { id: number; role: UserRole },
    confirmPermanentDelete?: boolean,
    reason?: string
  ): Promise<{ message: string; type: 'soft' | 'permanent'; cashRequest: any }> {
    const existingCashRequest = await this.cashRequestRepository.findById(id);
    if (!existingCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    // Validar permisos
    if (existingCashRequest.requestedBy !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permisos para eliminar esta solicitud');
    }

    // Validar eliminación
    this.validateCashRequestDeletion(existingCashRequest, currentUser, confirmPermanentDelete);

    if (confirmPermanentDelete) {
      // Eliminación permanente
      await this.cashRequestWriteRepository.delete(id);
      return {
        message: 'Solicitud de efectivo eliminada permanentemente',
        type: 'permanent',
        cashRequest: { id, deletedBy: currentUser.id, reason }
      };
    } else {
      // Soft delete
      const updatedCashRequest = await this.cashRequestWriteRepository.update(id, {
        valido: '0',
        deletedAt: new Date(),
        deletedBy: currentUser.id,
      });

      const enrichedRequests = await this.enrichWithUserData([updatedCashRequest]);
      return {
        message: 'Solicitud de efectivo eliminada (soft delete)',
        type: 'soft',
        cashRequest: enrichedRequests[0]
      };
    }
  }

  async restore(
    id: number,
    currentUser: { id: number; role: UserRole }
  ): Promise<{ message: string; cashRequest: any }> {
    // Solo admins pueden restaurar
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden restaurar solicitudes');
    }

    const deletedCashRequest = await this.cashRequestWriteRepository.findById(id);
    if (!deletedCashRequest) {
      throw new NotFoundException('Solicitud de efectivo no encontrada');
    }

    if (deletedCashRequest.valido === '1') {
      throw new BadRequestException('La solicitud ya está activa');
    }

    // Restaurar la solicitud
    const restoredCashRequest = await this.cashRequestWriteRepository.update(id, {
      valido: '1',
      deletedAt: null,
      deletedBy: null,
    });

    const enrichedRequests = await this.enrichWithUserData([restoredCashRequest]);
    return {
      message: 'Solicitud de efectivo restaurada exitosamente',
      cashRequest: enrichedRequests[0]
    };
  }

  async findDeleted(): Promise<ICashRequestResponse[]> {
    const deletedCashRequests = await this.cashRequestWriteRepository.findByValid('0');
    return await this.enrichWithUserData(deletedCashRequests);
  }

  private validateCashRequestDeletion(
    cashRequest: any,
    currentUser: { id: number; role: UserRole },
    confirmPermanentDelete?: boolean
  ): void {
    if (confirmPermanentDelete && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden eliminar permanentemente');
    }

    if (cashRequest.status === CashRequestStatus.APPROVED) {
      throw new BadRequestException('No se puede eliminar una solicitud aprobada');
    }
  }

  private async enrichWithUserData(cashRequests: any[]): Promise<ICashRequestResponse[]> {
    const userIds = new Set<number>();
    
    // Recolectar todos los IDs de usuarios únicos
    cashRequests.forEach(cashRequest => {
      userIds.add(cashRequest.requestedBy);
      if (cashRequest.approvedBy) {
        userIds.add(cashRequest.approvedBy);
      }
    });

    // Obtener información de usuarios
    const users = await Promise.all(
      Array.from(userIds).map(id => this.userRepository.findById(id))
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
      requestedBy: cashRequest.requestedBy,
      requestedByUser: userMap.get(cashRequest.requestedBy),
      requestedAmount: Number(cashRequest.requestedAmount),
      requestType: cashRequest.requestType,
      division: cashRequest.division,
      paymentType: cashRequest.paymentType,
      status: cashRequest.status,
      createdAt: cashRequest.createdAt,
      updatedAt: cashRequest.updatedAt,
      approvedBy: cashRequest.approvedBy,
      approvedByUser: cashRequest.approvedBy ? userMap.get(cashRequest.approvedBy) : undefined,
      approvedAt: cashRequest.approvedAt,
      notes: cashRequest.notes,
      valid: cashRequest.valido,
      deletedAt: cashRequest.deletedAt,
      deletedBy: cashRequest.deletedBy,
    }));
  }
} 