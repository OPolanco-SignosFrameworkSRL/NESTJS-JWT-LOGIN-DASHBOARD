import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UseGuards, 
  Request,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam,
  getSchemaPath
} from '@nestjs/swagger';
import { PagoNoLiquidadoService } from '../../core/domain/services/pago-no-liquidado.service';
import { PagoNoLiquidadoQueryDto } from '../../core/application/dto/pago-no-liquidado-query.dto';
import { 
  PagosNoLiquidadosListResponseDto, 
  PagoNoLiquidadoResponseDto 
} from '../../core/application/dto/pago-no-liquidado-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Pagos No Liquidados')
@Controller('pagos-no-liquidados')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PagosNoLiquidadosController {
  constructor(private readonly pagoNoLiquidadoService: PagoNoLiquidadoService) {}

  @Get()
  @Roles(1, 4) // Administrador y otros roles con permisos
  @ApiOperation({ 
    summary: 'Obtener listado de pagos no liquidados con filtros',
    description: 'Obtiene una lista paginada de pagos no liquidados con opciones de filtrado por búsqueda, división y estado.'
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Buscar en número de desembolso y beneficiario',
    example: 'DES-2025' 
  })
  @ApiQuery({ 
    name: 'division', 
    required: false, 
    description: 'Filtrar por nombre de división',
    example: 'Finanzas' 
  })
  @ApiQuery({ 
    name: 'estado', 
    required: false, 
    description: 'Estado del pago (Activo o Cancelado)',
    example: 'Activo',
    enum: ['Activo', 'Cancelado']
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número de página',
    example: 1,
    type: Number 
  })
  @ApiQuery({ 
    name: 'pageSize', 
    required: false, 
    description: 'Tamaño de página',
    example: 10,
    type: Number 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pagos no liquidados obtenida exitosamente',
    type: PagosNoLiquidadosListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido o ausente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para acceder a este recurso',
  })
  async findAll(
    @Query() query: PagoNoLiquidadoQueryDto,
    @Request() req: any
  ): Promise<PagosNoLiquidadosListResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.findAll(query, userId);
  }

  @Get('stats')
  @Roles(1, 4)
  @ApiOperation({ 
    summary: 'Obtener estadísticas de pagos no liquidados',
    description: 'Obtiene estadísticas generales sobre los pagos no liquidados (totales por estado, montos, etc.)'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalActivos: { type: 'number', example: 25 },
        totalCancelados: { type: 'number', example: 5 },
        totalGeneral: { type: 'number', example: 30 },
        montoTotal: { type: 'number', example: 125750.50 }
      }
    }
  })
  async getStats() {
    return this.pagoNoLiquidadoService.getStats();
  }

  @Get(':id')
  @Roles(1, 4)
  @ApiOperation({ 
    summary: 'Obtener un pago no liquidado por ID',
    description: 'Obtiene los detalles completos de un pago no liquidado específico.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del pago no liquidado',
    example: 1,
    type: Number 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago no liquidado encontrado',
    type: PagoNoLiquidadoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no liquidado no encontrado',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.findById(id, userId);
  }

  @Post()
  @Roles(1, 4)
  @ApiOperation({ 
    summary: 'Crear un nuevo pago no liquidado',
    description: 'Crea un nuevo registro de pago no liquidado en el sistema.'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pago no liquidado creado exitosamente',
    type: PagoNoLiquidadoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createData: any, // TODO: Crear CreatePagoNoLiquidadoDto
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.create(createData, userId);
  }

  @Put(':id')
  @Roles(1, 4)
  @ApiOperation({ 
    summary: 'Actualizar un pago no liquidado',
    description: 'Actualiza los datos de un pago no liquidado existente.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del pago no liquidado',
    example: 1,
    type: Number 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago no liquidado actualizado exitosamente',
    type: PagoNoLiquidadoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no liquidado no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para editar este pago',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any, // TODO: Crear UpdatePagoNoLiquidadoDto
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.update(id, updateData, userId);
  }

  @Patch(':id/cancel')
  @Roles(1, 4)
  @ApiOperation({ 
    summary: 'Cancelar un pago no liquidado',
    description: 'Cambia el estado de un pago no liquidado a "Cancelado".'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del pago no liquidado',
    example: 1,
    type: Number 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago no liquidado cancelado exitosamente',
    type: PagoNoLiquidadoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no liquidado no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para cancelar este pago o el pago ya está cancelado',
  })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.cancel(id, userId);
  }

  @Patch(':id/reverse')
  @Roles(1) // Solo administradores
  @ApiOperation({ 
    summary: 'Reversar un pago cancelado',
    description: 'Reactiva un pago no liquidado que estaba cancelado. Solo disponible para administradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del pago no liquidado',
    example: 1,
    type: Number 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago no liquidado reversado exitosamente',
    type: PagoNoLiquidadoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no liquidado no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para reversar este pago o el pago no está cancelado',
  })
  async reverse(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    return this.pagoNoLiquidadoService.reverse(id, userId);
  }
}
