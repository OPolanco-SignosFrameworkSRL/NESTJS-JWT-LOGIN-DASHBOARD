import { Controller, Post, Body, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateRequestStatusDto, RequestStatusAction } from '../../core/application/dto/update-request-status.dto';
import { UpdateRequestStatusUseCase } from '../../core/application/use-cases/update-request-status.use-case';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

@ApiTags('Admin - Gestión de Solicitudes - X')
@Controller('admin/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminRequestController {
  constructor(
    private readonly updateRequestStatusUseCase: UpdateRequestStatusUseCase,
  ) {}

  @Post('status')
  @Roles(1) // Admin
  @ApiOperation({
    summary: 'Actualizar estado de una solicitud',
    description: 'Permite a los administradores aprobar, autorizar o rechazar solicitudes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado de la solicitud actualizado exitosamente',
    schema: {
      example: {
        data: {
          success: true,
          message: 'Solicitud aprobada exitosamente',
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
    description: 'Solicitud no encontrada',
  })
  async updateRequestStatus(
    @Body() updateStatusDto: UpdateRequestStatusDto,
    @Request() req,
  ) {
    try {
      const user = req.user;
      
      const result = await this.updateRequestStatusUseCase.execute({
        requestId: updateStatusDto.requestId,
        action: updateStatusDto.action,
        comment: updateStatusDto.comment,
        actionDate: updateStatusDto.actionDate,
        adminUserId: user.id,
      });

      return {
        data: result,
        statusCode: 200,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }
}
