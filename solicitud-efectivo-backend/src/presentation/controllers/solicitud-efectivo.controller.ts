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
    ParseIntPipe 
  } from "@nestjs/common";
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
  import { SolicitudEfectivoService } from "@/core/domain/services/solicitud-efectivo.service";
  import { CreateSolicitudDto } from "@/core/application/dto/create-solicitud.dto";
  import { JwtAuthGuard } from "../guards/jwt-auth.guard";
  import { RolesGuard } from "../guards/roles.guard";

@ApiTags('Solicitudes')
@ApiBearerAuth()
@Controller('solicitud-efectivo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudEfectivoController {
    constructor(private solicitudService: SolicitudEfectivoService) {}

    @Post()
    @ApiOperation({ summary: 'Crear nueva solicitud de efectivo' })
    @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
    create(@Body() createDto: CreateSolicitudDto, @Req() req: any) {
        return this.solicitudService.create(createDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las solicitudes' })
    @ApiResponse({ status: 200, description: 'Lista de solicitudes obtenida' })
    findAll(@Req() req: any) {
        return this.solicitudService.findAll(req.user);
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