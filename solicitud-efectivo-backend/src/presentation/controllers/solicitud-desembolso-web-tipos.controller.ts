import { Controller, Get, Param, UseGuards, ParseIntPipe, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { SolicitudDesembolsoWebTiposService } from '../../core/domain/services/solicitud-desembolso-web-tipos.service';
import { SolicitudDesembolsoWebTiposResponseDto } from '../../core/application/dto/solicitud-desembolso-web-tipos-response.dto';
import { TipoSolicitudFiltersDto } from '../../core/application/dto/tipo-solicitud-filters.dto';
import { CreateTipoSolicitudDto } from '../../core/application/dto/create-tipo-solicitud.dto';
import { UpdateTipoSolicitudDto } from '../../core/application/dto/update-tipo-solicitud.dto';

@ApiTags('Tipos de Solicitud')
@Controller('solicitud-desembolso-web-tipos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SolicitudDesembolsoWebTiposController {
  constructor(
    private readonly solicitudDesembolsoWebTiposService: SolicitudDesembolsoWebTiposService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener tipos de solicitud con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por descripción' })
  @ApiQuery({ name: 'statusId', required: false, type: Number, description: 'Estado: 1=Activo, 2=Inactivo' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de tipos de solicitud', type: [SolicitudDesembolsoWebTiposResponseDto] })
  async findAll(@Query() filters: TipoSolicitudFiltersDto) {
    return await this.solicitudDesembolsoWebTiposService.findAll(filters);
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un tipo de solicitud desembolso web por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de solicitud desembolso web', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tipo de solicitud desembolso web obtenido exitosamente',
    type: SolicitudDesembolsoWebTiposResponseDto
  })
  @ApiResponse({ status: 404, description: 'Tipo de solicitud desembolso web no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<SolicitudDesembolsoWebTiposResponseDto> {
    return await this.solicitudDesembolsoWebTiposService.findById(id);
  }

  @Post()
  @Roles(1)
  @ApiOperation({ summary: 'Crear un tipo de solicitud' })
  @ApiResponse({ status: 201, description: 'Creado', type: SolicitudDesembolsoWebTiposResponseDto })
  async create(@Body() dto: CreateTipoSolicitudDto) {
    return await this.solicitudDesembolsoWebTiposService.create(dto);
  }

  @Put(':id')
  @Roles(1)
  @ApiOperation({ summary: 'Actualizar un tipo de solicitud' })
  @ApiResponse({ status: 200, description: 'Actualizado', type: SolicitudDesembolsoWebTiposResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoSolicitudDto) {
    return await this.solicitudDesembolsoWebTiposService.update(id, dto);
  }

  @Delete(':id')
  @Roles(1)
  @ApiOperation({ summary: 'Eliminar un tipo de solicitud (si no tiene dependencias)' })
  @ApiResponse({ status: 200, description: 'Eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.solicitudDesembolsoWebTiposService.remove(id);
  }
}
