import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    Req, 
    UseGuards,
    ParseIntPipe,
    Inject,
    Query
  } from "@nestjs/common";
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
  import { SolicitudEfectivoService } from "@/core/domain/services/solicitud-efectivo.service";
  import { CreateSolicitudDto } from "@/core/application/dto/create-solicitud.dto";
  import { SolicitudOnlyResponseDto } from "@/core/application/dto/solicitud-only-response.dto";
  import { PaginationDto } from "@/core/application/dto/pagination.dto";
  import { JwtAuthGuard } from "../guards/jwt-auth.guard";
  import { RolesGuard } from "../guards/roles.guard";
  import { Roles } from "../decorators/roles.decorator";
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { SolicitudEfectivoEntity } from '../../infrastructure/database/entities/solicitud-efectivo.entity';

@ApiTags('Solicitudes')
@ApiBearerAuth()
@Controller('solicitud-efectivo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudEfectivoController {
    constructor(
      private solicitudService: SolicitudEfectivoService,
      @InjectRepository(SolicitudEfectivoEntity)
      private readonly solicitudRepository: Repository<SolicitudEfectivoEntity>,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Crear nueva solicitud de efectivo' })
    @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
    create(@Body() createDto: CreateSolicitudDto, @Req() req: any) {
        return this.solicitudService.create(createDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener solicitudes paginadas' })
    @ApiResponse({ status: 200, description: 'Lista de solicitudes paginada' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    findAll(@Req() req: any, @Query() query: PaginationDto) {
        return this.solicitudService.findAll(req.user, query);
    }

    @Get('only')
    @Roles(1) // Admin
    @ApiOperation({ summary: 'Obtener lista simple de solicitudes de efectivo' })
    @ApiResponse({ 
      status: 200, 
      description: 'Lista de solicitudes obtenida exitosamente',
      type: [SolicitudOnlyResponseDto]
    })
    async getOnly() {
      // Usar las relaciones de TypeORM para obtener datos reales de la base de datos
      const solicitudes = await this.solicitudRepository.find({
        relations: ['usuario', 'tipoSolicitud'],
        order: { id: 'DESC' }
      });

      return solicitudes.map(solicitud => ({
        id: solicitud.id,
        tipoSolicitud: solicitud.tipoSolicitud?.tipoDesc || 'Desconocido',
        nombreUsuario: `${solicitud.usuario?.nombre} ${solicitud.usuario?.apellido}`.trim(),
        cedula: solicitud.usuario?.cedula,
        monto: solicitud.monto,
        tipoPago: 'Efectivo'
      }));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener solicitud por ID' })
    @ApiResponse({ status: 200, description: 'Solicitud obtenida' })
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.solicitudService.findOne(id, req.user);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar solicitud' })
    @ApiResponse({ status: 200, description: 'Solicitud actualizada' })
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateDto: any, 
        @Req() req: any
    ) {
        return this.solicitudService.update(id, updateDto, req.user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar solicitud' })
    @ApiResponse({ status: 200, description: 'Solicitud eliminada' })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.solicitudService.remove(id, req.user);
    }
}