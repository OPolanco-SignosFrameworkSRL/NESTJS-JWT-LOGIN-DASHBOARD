import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { TipoPagoService } from '../../core/domain/services/tipo-pago.service';
import { TipoPagoResponseDto } from '../../core/application/dto/tipo-pago-response.dto';

@ApiTags('Tipos de Pago')
@Controller('tipo-pago')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TipoPagoController {
  constructor(
    private readonly tipoPagoService: TipoPagoService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todos los tipos de pago' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de pago obtenida exitosamente',
    type: [TipoPagoResponseDto]
  })
  async findAll(): Promise<TipoPagoResponseDto[]> {
    return await this.tipoPagoService.findAll();
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un tipo de pago por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de pago', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tipo de pago obtenido exitosamente',
    type: TipoPagoResponseDto
  })
  @ApiResponse({ status: 404, description: 'Tipo de pago no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TipoPagoResponseDto> {
    return await this.tipoPagoService.findById(id);
  }
}
