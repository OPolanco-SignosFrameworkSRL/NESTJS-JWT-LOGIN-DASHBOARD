import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ICashRequestService } from '../../core/domain/cash-request.service.interface';
import { CreateCashRequestDto } from '../../core/application/dto/create-cash-request.dto';
import { UpdateCashRequestDto } from '../../core/application/dto/update-cash-request.dto';
import { CashRequestFiltersDto } from '../../core/application/dto/cash-request-filters.dto';
import { ApproveCashRequestDto } from '../../core/application/dto/approve-cash-request.dto';
import { DeleteCashRequestDto } from '../../core/application/dto/delete-cash-request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../core/domain/interfaces/user.interface';
import { ICashRequestResponse, ICashRequestStats } from '../../core/domain/interfaces/cash-request.interface';
import { PaginationDto, PaginatedResponseDto } from '../../core/application/dto/pagination.dto';

@ApiTags('Solicitudes de Efectivo')
@ApiBearerAuth()
@Controller('cash-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRequestController {
  constructor(
    @Inject('ICashRequestService')
    private readonly cashRequestService: ICashRequestService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las solicitudes de efectivo',
    description: 'Retorna una lista paginada de todas las solicitudes de efectivo activas',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes de efectivo obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              requestedBy: { type: 'number' },
              requestedByUser: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  nombre: { type: 'string' },
                  apellido: { type: 'string' },
                  cedula: { type: 'string' },
                },
              },
              requestedAmount: { type: 'number' },
              requestType: { type: 'string' },
              division: { type: 'string' },
              paymentType: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number', example: 150 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 15 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false }
      },
    },
  })
  async findAll(@Query() filters: CashRequestFiltersDto): Promise<PaginatedResponseDto<ICashRequestResponse>> {
    return await this.cashRequestService.findAll(filters);
  }

  @Get('my-requests')
  @ApiOperation({
    summary: 'Obtener mis solicitudes de efectivo',
    description: 'Retorna las solicitudes de efectivo del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes del usuario obtenida exitosamente',
  })
  async findMyRequests(@Req() req: any): Promise<ICashRequestResponse[]> {
    return await this.cashRequestService.findByUser(req.user.id);
  }

  @Get('filters')
  @ApiOperation({
    summary: 'Obtener solicitudes con filtros',
    description: 'Retorna solicitudes de efectivo aplicando filtros específicos',
  })
  @ApiQuery({ name: 'status', required: false, description: 'Estado de la solicitud' })
  @ApiQuery({ name: 'division', required: false, description: 'División' })
  @ApiQuery({ name: 'requestType', required: false, description: 'Tipo de solicitud' })
  @ApiQuery({ name: 'requestedBy', required: false, description: 'ID del usuario solicitante' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Monto mínimo' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Monto máximo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes filtradas obtenida exitosamente',
  })
  async findByFilters(@Query() filters: CashRequestFiltersDto): Promise<ICashRequestResponse[]> {
    const convertedFilters = {
      ...filters,
      /*
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      */
      startDate: filters.startDate ? filters.startDate : undefined, // Mantener como string
      endDate: filters.endDate ? filters.endDate : undefined,       // Mantener como string
    };
    return await this.cashRequestService.findByFilters(convertedFilters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas de solicitudes',
    description: 'Retorna estadísticas generales de las solicitudes de efectivo',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  @Roles(1) // Admin
  async getStats(): Promise<ICashRequestStats> {
    return await this.cashRequestService.getStats();
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Obtener solicitudes pendientes de aprobación',
    description: 'Retorna las solicitudes de efectivo que están pendientes de aprobación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes pendientes obtenida exitosamente',
  })
  @Roles(1, 3, 4) // Admin, Manager, Supervisor
  async findPendingRequests(): Promise<ICashRequestResponse[]> {
    return await this.cashRequestService.findPendingRequests();
  }

  @Get('deleted/list')
  @ApiOperation({
    summary: 'Obtener lista de solicitudes eliminadas',
    description: 'Retorna las solicitudes de efectivo que han sido eliminadas (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes eliminadas obtenida exitosamente',
  })
  @Roles(1) // Admin
  async findDeleted(): Promise<ICashRequestResponse[]> {
    return await this.cashRequestService.findDeleted();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener solicitud por ID',
    description: 'Retorna una solicitud de efectivo específica por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ICashRequestResponse | null> {
    return await this.cashRequestService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear nueva solicitud de efectivo',
    description: 'Crea una nueva solicitud de efectivo para el usuario autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createCashRequestDto: CreateCashRequestDto,
    @Req() req: any
  ): Promise<ICashRequestResponse> {
    return await this.cashRequestService.create(createCashRequestDto, req.user);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar solicitud de efectivo',
    description: 'Actualiza una solicitud de efectivo existente',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para editar esta solicitud',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCashRequestDto: UpdateCashRequestDto,
    @Req() req: any
  ): Promise<ICashRequestResponse> {
    return await this.cashRequestService.update(id, updateCashRequestDto, req.user);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Aprobar solicitud de efectivo',
    description: 'Aprueba una solicitud de efectivo pendiente (solo usuarios autorizados)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud aprobada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para aprobar solicitudes',
  })
  @Roles(1, 3, 4) // Admin, Manager, Supervisor
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveCashRequestDto: ApproveCashRequestDto,
    @Req() req: any
  ): Promise<ICashRequestResponse> {
    return await this.cashRequestService.approve(id, req.user, approveCashRequestDto.notes);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Rechazar solicitud de efectivo',
    description: 'Rechaza una solicitud de efectivo pendiente (solo usuarios autorizados)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud rechazada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para rechazar solicitudes',
  })
  @Roles(1, 3, 4) // Admin, Manager, Supervisor
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveCashRequestDto: ApproveCashRequestDto,
    @Req() req: any
  ): Promise<ICashRequestResponse> {
    return await this.cashRequestService.reject(id, req.user, approveCashRequestDto.notes);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restaurar solicitud eliminada',
    description: 'Restaura una solicitud de efectivo eliminada (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud restaurada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los administradores pueden restaurar solicitudes',
  })
  @Roles(1) // Admin
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ): Promise<{ message: string; cashRequest: any }> {
    return await this.cashRequestService.restore(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar solicitud de efectivo',
    description: 'Elimina una solicitud de efectivo (soft delete por defecto, permanente con confirmación)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        type: { type: 'string', enum: ['soft', 'permanent'] },
        cashRequest: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para eliminar esta solicitud',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteCashRequestDto: DeleteCashRequestDto,
    @Req() req: any
  ): Promise<{ message: string; type: 'soft' | 'permanent'; cashRequest: any }> {
    return await this.cashRequestService.remove(
      id,
      req.user,
      deleteCashRequestDto.confirmPermanentDelete,
      deleteCashRequestDto.reason
    );
  }
} 