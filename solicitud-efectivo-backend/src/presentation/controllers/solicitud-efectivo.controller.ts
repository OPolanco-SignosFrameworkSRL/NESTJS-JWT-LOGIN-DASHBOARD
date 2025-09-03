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

}