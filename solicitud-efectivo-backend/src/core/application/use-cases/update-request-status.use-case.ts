import { Injectable, Inject, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateRequestStatusDto, RequestStatusAction } from '../dto/update-request-status.dto';
import { ICashRequestRepository } from '../../domain/repositories/cash-request.repository.interface';
import { CASH_REQUEST_REPOSITORY } from '../tokens';

export interface UpdateRequestStatusRequest {
  requestId: number;
  action: RequestStatusAction;
  comment?: string;
  actionDate?: string;
  adminUserId: number;
}

export interface UpdateRequestStatusResponse {
  success: boolean;
  message: string;
  requestId: number;
  newStatus: number;
  newStatusText: string;
  action: string;
  adminUserId: number;
  actionDate: Date;
}

@Injectable()
export class UpdateRequestStatusUseCase {
  constructor(
    @Inject(CASH_REQUEST_REPOSITORY)
    private readonly cashRequestRepository: ICashRequestRepository,
  ) {}

  async execute(request: UpdateRequestStatusRequest): Promise<UpdateRequestStatusResponse> {
    const { requestId, action, comment, actionDate, adminUserId } = request;

    // Obtener la solicitud actual
    const currentRequest = await this.cashRequestRepository.findById(requestId);
    if (!currentRequest) {
      throw new NotFoundException(`Solicitud con ID ${requestId} no encontrada`);
    }

    // Validar el estado actual y la acción solicitada
    this.validateStatusTransition(currentRequest.solicitud_status, action);

    // Determinar el nuevo estado
    const newStatus = this.getNewStatus(action);
    const newStatusText = this.getStatusText(newStatus);

    // Actualizar la solicitud
    const updatedRequest = await this.cashRequestRepository.updateStatus(
      requestId,
      newStatus,
      adminUserId,
      action,
      comment,
      actionDate ? new Date(actionDate) : new Date(),
    );

    if (!updatedRequest) {
      throw new BadRequestException('Error al actualizar el estado de la solicitud');
    }

    return {
      success: true,
      message: `Solicitud ${newStatusText.toLowerCase()} exitosamente`,
      requestId,
      newStatus,
      newStatusText,
      action,
      adminUserId,
      actionDate: new Date(),
    };
  }

  private validateStatusTransition(currentStatus: number, action: RequestStatusAction): void {
    switch (action) {
      case RequestStatusAction.APPROVE:
        if (currentStatus !== 1) { // Solo se puede aprobar si está pendiente
          throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
        }
        break;
      
      case RequestStatusAction.VERIFY:
        if (currentStatus !== 2) { // Solo se puede verificar si está aprobada
          throw new BadRequestException('Solo se pueden verificar solicitudes aprobadas');
        }
        break;

      case RequestStatusAction.AUTHORIZE:
        if (currentStatus !== 6) { // Solo se puede autorizar si está verificada
          throw new BadRequestException('Solo se pueden autorizar solicitudes aprobadas');
        }
        break;

      case RequestStatusAction.REJECT:
        // Se puede rechazar en cualquier estado excepto si ya está rechazada
        if (currentStatus === 4) {
          throw new BadRequestException('La solicitud ya está rechazada');
        }
        break;

      default:
        throw new BadRequestException('Acción no válida');
    }
  }

  private getNewStatus(action: RequestStatusAction): number {
    switch (action) {
      case RequestStatusAction.APPROVE:
        return 2; // APROBADA
      case RequestStatusAction.AUTHORIZE:
        return 3; // AUTORIZADO
      case RequestStatusAction.REJECT:
        return 4; // RECHAZADA
      case RequestStatusAction.VERIFY:
        return 6; // VERIFICADA
      default:
        throw new BadRequestException('Acción no válida');
    }
  }

  private getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'PENDIENTE';
      case 2:
        return 'APROBADA';
      case 3:
        return 'AUTORIZADO';
      case 4:
        return 'RECHAZADA';
      case 6:
        return 'VERIFICADA';
      default:
        return 'DESCONOCIDO';
    }
  }
}
