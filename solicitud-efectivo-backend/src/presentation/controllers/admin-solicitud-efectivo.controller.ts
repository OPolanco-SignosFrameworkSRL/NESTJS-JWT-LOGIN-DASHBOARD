import { Controller, Post, Body, UseGuards, Request, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateRequestStatusDto, RequestStatusAction } from '../../core/application/dto/update-request-status.dto';
import { SolicitudEfectivoService } from '../../core/domain/services/solicitud-efectivo.service';
import { SolicitudEfectivoStatus } from '../../core/domain/interfaces/solicitud-efectivo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudEfectivoEntity } from '../../infrastructure/database/entities/solicitud-efectivo.entity';

@ApiTags('Admin - Gestión de Solicitudes de Efectivo')
@Controller('admin/solicitud-efectivo')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminSolicitudEfectivoController {
  constructor(
    private readonly solicitudEfectivoService: SolicitudEfectivoService,
    @InjectRepository(SolicitudEfectivoEntity)
    private readonly solicitudRepository: Repository<SolicitudEfectivoEntity>,
  ) {}

  @Post('status')
  @Roles(1) // Admin
  @ApiOperation({
    summary: 'Actualizar estado de una solicitud de efectivo',
    description: 'Permite a los administradores aprobar, autorizar o rechazar solicitudes de efectivo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado de la solicitud de efectivo actualizado exitosamente',
    schema: {
      example: {
        data: {
          success: true,
          message: 'Solicitud de efectivo aprobada exitosamente',
          requestId: 5,
          newStatus: 2,
          newStatusText: 'APROBADA',
          action: 'approve',
          adminUserId: 1,
          actionDate: '2024-01-15T10:30:00.000Z',
        },
        statusCode: 200,
        message: 'Operación exitosa',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o acción no permitida',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuario no tiene permisos de administrador',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solicitud de efectivo no encontrada',
  })
  async updateRequestStatus(
    @Body() updateStatusDto: UpdateRequestStatusDto,
    @Request() req,
  ) {
    try {
      const user = req.user;
      
      // Obtener la solicitud actual para validar el estado
      const currentRequest = await this.solicitudEfectivoService.findOne(updateStatusDto.requestId, user);
      
      // Validar la transición de estado
      this.validateStatusTransition(currentRequest.statusId, updateStatusDto.action);
      
      // Determinar el nuevo estado
      const newStatus = this.getNewStatus(updateStatusDto.action);
      const newStatusText = this.getStatusText(newStatus);
      
      // Actualizar directamente en la base de datos solo el statusId
      await this.solicitudRepository.update(
        { id: updateStatusDto.requestId },
        { statusId: newStatus }
      );

      return {
        data: {
          success: true,
          message: `Solicitud de efectivo ${newStatusText.toLowerCase()} exitosamente`,
          requestId: updateStatusDto.requestId,
          newStatus,
          newStatusText,
          action: updateStatusDto.action,
          adminUserId: user.id,
          actionDate: new Date().toISOString(),
        },
        statusCode: 200,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  private validateStatusTransition(currentStatus: number, action: RequestStatusAction): void {
    switch (action) {
      case RequestStatusAction.APPROVE:
        if (currentStatus !== SolicitudEfectivoStatus.PENDIENTE) {
          throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
        }
        break;
      
      case RequestStatusAction.VERIFY:
        if (currentStatus !== SolicitudEfectivoStatus.APROBADA) {
          throw new BadRequestException('Solo se pueden verificar solicitudes aprobadas');
        }
        break;

      case RequestStatusAction.AUTHORIZE:
        if (currentStatus !== SolicitudEfectivoStatus.VERIFICADA) {
          throw new BadRequestException('Solo se pueden autorizar solicitudes verificadas');
        }
        break;

      case RequestStatusAction.REJECT:
        // Se puede rechazar en cualquier estado excepto si ya está autorizada, rechazada o desembolsada
        if (currentStatus === SolicitudEfectivoStatus.AUTORIZADO) {
          throw new BadRequestException('No es posible rechazar una solicitud que ya fue autorizada');
        }
        if (currentStatus === SolicitudEfectivoStatus.RECHAZADA || 
            currentStatus === SolicitudEfectivoStatus.DESEMBOLSADO) {
          throw new BadRequestException('La solicitud ya está rechazada o desembolsada');
        }
        break;

      default:
        throw new BadRequestException('Acción no válida');
    }
  }

  private getNewStatus(action: RequestStatusAction): number {
    switch (action) {
      case RequestStatusAction.APPROVE:
        return SolicitudEfectivoStatus.APROBADA;
      case RequestStatusAction.VERIFY:
        return SolicitudEfectivoStatus.VERIFICADA;
      case RequestStatusAction.AUTHORIZE:
        return SolicitudEfectivoStatus.AUTORIZADO;
      case RequestStatusAction.REJECT:
        return SolicitudEfectivoStatus.RECHAZADA;
      default:
        throw new BadRequestException('Acción no válida');
    }
  }

  private getStatusText(status: number): string {
    switch (status) {
      case SolicitudEfectivoStatus.PENDIENTE:
        return 'PENDIENTE';
      case SolicitudEfectivoStatus.APROBADA:
        return 'APROBADA';
      case SolicitudEfectivoStatus.VERIFICADA:
        return 'VERIFICADA';
      case SolicitudEfectivoStatus.AUTORIZADO:
        return 'AUTORIZADO';
      case SolicitudEfectivoStatus.RECHAZADA:
        return 'RECHAZADA';
      case SolicitudEfectivoStatus.DESEMBOLSADO:
        return 'DESEMBOLSADO';
      default:
        return 'DESCONOCIDO';
    }
  }
}
