import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
  Body,
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
import { ISolicitudGeneralService } from '../../core/domain/solicitud-general.service.interface';
import { SolicitudGeneralFiltersDto } from '../../core/application/dto/solicitud-general-filters.dto';
import { ApproveSolicitudGeneralDto } from '../../core/application/dto/approve-solicitud-general.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../core/domain/user.interface';
import { ISolicitudGeneralResponse, ISolicitudGeneralStats } from '../../core/domain/solicitud-general.interface';

@ApiTags('Solicitudes Generales')
@ApiBearerAuth()
@Controller('solicitudes-generales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudGeneralController {
  constructor(
    @Inject('ISolicitudGeneralService')
    private readonly solicitudGeneralService: ISolicitudGeneralService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las solicitudes generales',
    description: 'Retorna una lista de todas las solicitudes generales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes generales obtenida exitosamente',
  })
  async findAll(): Promise<ISolicitudGeneralResponse[]> {
    return await this.solicitudGeneralService.findAll();
  }

  @Get('my-requests')
  @ApiOperation({
    summary: 'Obtener mis solicitudes generales',
    description: 'Retorna las solicitudes generales del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes del usuario obtenida exitosamente',
  })
  async findMyRequests(@Req() req: any): Promise<ISolicitudGeneralResponse[]> {
    return await this.solicitudGeneralService.findByUser(req.user.id);
  }

  @Get('filters')
  @ApiOperation({
    summary: 'Obtener solicitudes con filtros',
    description: 'Retorna solicitudes generales aplicando filtros específicos',
  })
  @ApiQuery({ name: 'solicitada_porid', required: false, description: 'ID del usuario solicitante' })
  @ApiQuery({ name: 'solicitud_tipo', required: false, description: 'Tipo de solicitud' })
  @ApiQuery({ name: 'solicitud_status', required: false, description: 'Estado de la solicitud' })
  @ApiQuery({ name: 'departamento', required: false, description: 'Departamento' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Monto mínimo' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Monto máximo' })
  @ApiQuery({ name: 'usuarionombre', required: false, description: 'Nombre del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes filtradas obtenida exitosamente',
  })
  async findByFilters(@Query() filters: SolicitudGeneralFiltersDto): Promise<ISolicitudGeneralResponse[]> {
    const convertedFilters = {
      ...filters,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    };
    return await this.solicitudGeneralService.findByFilters(convertedFilters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas de solicitudes',
    description: 'Retorna estadísticas generales de las solicitudes',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  @Roles(UserRole.Admin)
  async getStats(): Promise<ISolicitudGeneralStats> {
    return await this.solicitudGeneralService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener solicitud por ID',
    description: 'Retorna una solicitud específica por su ID',
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
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ISolicitudGeneralResponse | null> {
    return await this.solicitudGeneralService.findById(id);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Aprobar solicitud general',
    description: 'Aprueba una solicitud general pendiente (solo administradores)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud aprobada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los administradores pueden aprobar solicitudes',
  })
  @Roles(UserRole.Admin)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveSolicitudDto: ApproveSolicitudGeneralDto,
    @Req() req: any
  ): Promise<ISolicitudGeneralResponse> {
    return await this.solicitudGeneralService.approve(id, req.user, approveSolicitudDto.notes);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Rechazar solicitud general',
    description: 'Rechaza una solicitud general pendiente (solo administradores)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud rechazada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los administradores pueden rechazar solicitudes',
  })
  @Roles(UserRole.Admin)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveSolicitudDto: ApproveSolicitudGeneralDto,
    @Req() req: any
  ): Promise<ISolicitudGeneralResponse> {
    return await this.solicitudGeneralService.reject(id, req.user, approveSolicitudDto.notes);
  }
} 