import { Controller, Post, Get, Body, Param, UseGuards, Request, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateDesembolsoDto } from '../../core/application/dto/create-desembolso.dto';
import { CreateDesembolsoUseCase } from '../../core/application/use-cases/create-desembolso.use-case';
import { IDesembolsoService } from '../../core/domain/services/desembolso.service.interface';

@ApiTags('Desembolsos')
@Controller('desembolsos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DesembolsoController {
  constructor(
    private readonly createDesembolsoUseCase: CreateDesembolsoUseCase,
    @Inject('IDesembolsoService')
    private readonly desembolsoService: IDesembolsoService,
  ) {}

  @Post()
  @Roles('Admin', 'Administrator')
  @ApiOperation({ summary: 'Crear un nuevo desembolso' })
  @ApiResponse({ 
    status: 201, 
    description: 'Desembolso creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Desembolso registrado exitosamente' },
        desembolso: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            numero_desembolso: { type: 'string', example: 'DES-202408-001' },
            solicitud_id: { type: 'number', example: 5 },
            monto_desembolso: { type: 'number', example: 3500 },
            fecha_registro: { type: 'string', format: 'date-time' },
            estado: { type: 'string', example: 'Desembolsado' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o solicitud no autorizada' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para ejecutar desembolsos' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async createDesembolso(
    @Body() createDesembolsoDto: CreateDesembolsoDto,
    @Request() req,
  ) {
    return await this.createDesembolsoUseCase.execute(createDesembolsoDto, req.user);
  }

  @Get()
  @Roles('Admin', 'Administrator')
  @ApiOperation({ summary: 'Obtener todos los desembolsos' })
  @ApiResponse({ status: 200, description: 'Lista de desembolsos obtenida exitosamente' })
  async findAll() {
    return await this.desembolsoService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Administrator')
  @ApiOperation({ summary: 'Obtener un desembolso por ID' })
  @ApiParam({ name: 'id', description: 'ID del desembolso', example: 1 })
  @ApiResponse({ status: 200, description: 'Desembolso obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Desembolso no encontrado' })
  async findById(@Param('id') id: number) {
    return await this.desembolsoService.findById(id);
  }

  @Get('solicitud/:solicitudId')
  @Roles('Admin', 'Administrator')
  @ApiOperation({ summary: 'Obtener desembolsos por solicitud' })
  @ApiParam({ name: 'solicitudId', description: 'ID de la solicitud', example: 5 })
  @ApiResponse({ status: 200, description: 'Desembolsos de la solicitud obtenidos exitosamente' })
  async findBySolicitud(@Param('solicitudId') solicitudId: number) {
    return await this.desembolsoService.findBySolicitud(solicitudId);
  }

  @Get('responsable/:responsableId')
  @Roles('Admin', 'Administrator')
  @ApiOperation({ summary: 'Obtener desembolsos por responsable' })
  @ApiParam({ name: 'responsableId', description: 'ID del responsable', example: 30 })
  @ApiResponse({ status: 200, description: 'Desembolsos del responsable obtenidos exitosamente' })
  async findByResponsable(@Param('responsableId') responsableId: number) {
    return await this.desembolsoService.findByResponsable(responsableId);
  }
}
