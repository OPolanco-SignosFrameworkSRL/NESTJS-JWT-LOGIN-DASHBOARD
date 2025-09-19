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
import { CreatePagoNoLiquidadoDto } from '../../core/application/dto/create-pago-no-liquidado.dto';
import { UpdatePagoNoLiquidadoDto } from '../../core/application/dto/update-pago-no-liquidado.dto';

@ApiTags('Pagos No Liquidados')
@Controller('pagos-no-liquidados')
export class PagosNoLiquidadosController {
  constructor(private readonly pagoNoLiquidadoService: PagoNoLiquidadoService) {}

  @Get('test')
  // Sin autenticación para pruebas
  @ApiOperation({ 
    summary: 'ENDPOINT DE PRUEBA - Obtener listado de pagos no liquidados',
    description: 'Endpoint temporal para probar la funcionalidad sin autenticación.'
  })
  async findAllTest(
    @Query() query: PagoNoLiquidadoQueryDto,
  ): Promise<PagosNoLiquidadosListResponseDto> {
    return this.pagoNoLiquidadoService.findAll(query, 1); // Usuario de prueba
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
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

  @Post('test')
  // @Roles(1, 4) // Temporalmente sin autenticación para pruebas
  @ApiOperation({ 
    summary: 'ENDPOINT DE PRUEBA - Crear un nuevo pago no liquidado',
    description: 'Endpoint temporal para probar la funcionalidad sin autenticación.'
  })
  async createTest(
    @Body() createData: CreatePagoNoLiquidadoDto,
  ): Promise<PagoNoLiquidadoResponseDto> {
    const testUserId = 1; // Usuario de prueba
    // mapear snake_case -> camelCase para tabla real
    const payload = {
      desembolsoNumero: createData.desembolso_numero,
      solicitudId: createData.solicitud_id,
      fechaCreado: new Date(),
      creadoPorId: testUserId,
      solicitudMonto: createData.solicitud_monto,
      desembolsoMonto: createData.desembolso_monto,
      tipoPago: createData.tipo_pago,
      concepto: createData.concepto,
      beneficiario: createData.beneficiario,
      cedula: createData.cedula,
      estatus: createData.estatus ?? 1, // 1 = activo por defecto
      chequeNo: createData.cheque_no,
      transferenciaRef: createData.transferencia_ref,
      notas: createData.notas,
      cajaId: createData.caja_id,
      cuentaBanco: createData.cuenta_banco,
    };
    return this.pagoNoLiquidadoService.create(payload as any, testUserId);
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
    @Body() createData: CreatePagoNoLiquidadoDto,
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    // mapear snake_case -> camelCase para tabla real
    const payload = {
      desembolsoNumero: createData.desembolso_numero,
      solicitudId: createData.solicitud_id,
      fechaCreado: new Date(),
      creadoPorId: userId,
      solicitudMonto: createData.solicitud_monto,
      desembolsoMonto: createData.desembolso_monto,
      tipoPago: createData.tipo_pago,
      concepto: createData.concepto,
      beneficiario: createData.beneficiario,
      cedula: createData.cedula,
      estatus: createData.estatus ?? 1, // 1 = activo por defecto
      chequeNo: createData.cheque_no,
      transferenciaRef: createData.transferencia_ref,
      notas: createData.notas,
      cajaId: createData.caja_id,
      cuentaBanco: createData.cuenta_banco,
    };
    return this.pagoNoLiquidadoService.create(payload as any, userId);
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
    @Body() updateData: UpdatePagoNoLiquidadoDto,
    @Request() req: any
  ): Promise<PagoNoLiquidadoResponseDto> {
    const userId = req.user?.id;
    const payload: any = {};
    if (updateData.desembolso_numero !== undefined) payload.desembolsoNumero = updateData.desembolso_numero;
    if (updateData.solicitud_monto !== undefined) payload.solicitudMonto = updateData.solicitud_monto;
    if (updateData.desembolso_monto !== undefined) payload.desembolsoMonto = updateData.desembolso_monto;
    if (updateData.tipo_pago !== undefined) payload.tipoPago = updateData.tipo_pago;
    if (updateData.concepto !== undefined) payload.concepto = updateData.concepto;
    if (updateData.beneficiario !== undefined) payload.beneficiario = updateData.beneficiario;
    if (updateData.cedula !== undefined) payload.cedula = updateData.cedula;
    if (updateData.estatus !== undefined) payload.estatus = updateData.estatus;
    if (updateData.cheque_no !== undefined) payload.chequeNo = updateData.cheque_no;
    if (updateData.transferencia_ref !== undefined) payload.transferenciaRef = updateData.transferencia_ref;
    if (updateData.notas !== undefined) payload.notas = updateData.notas;
    if (updateData.caja_id !== undefined) payload.cajaId = updateData.caja_id;
    if (updateData.cuenta_banco !== undefined) payload.cuentaBanco = updateData.cuenta_banco;
    return this.pagoNoLiquidadoService.update(id, payload, userId);
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
