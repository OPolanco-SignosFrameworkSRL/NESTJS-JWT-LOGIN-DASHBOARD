import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { SolicitudDesembolsoWebTiposService } from '../../core/domain/services/solicitud-desembolso-web-tipos.service';
import { SolicitudDesembolsoWebTiposResponseDto } from '../../core/application/dto/solicitud-desembolso-web-tipos-response.dto';

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
  @ApiOperation({ summary: 'Obtener todos los tipos de solicitud desembolso web' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de solicitud desembolso web obtenida exitosamente',
    type: [SolicitudDesembolsoWebTiposResponseDto]
  })
  async findAll(): Promise<SolicitudDesembolsoWebTiposResponseDto[]> {
    return await this.solicitudDesembolsoWebTiposService.findAll();
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
}
