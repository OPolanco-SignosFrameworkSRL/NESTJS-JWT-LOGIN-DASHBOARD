import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { DivisionService } from '../../core/domain/services/division.service';
import { CreateDivisionDto } from '../../core/application/dto/create-division.dto';
import { UpdateDivisionDto } from '../../core/application/dto/update-division.dto';
import { DivisionResponseDto } from '../../core/application/dto/division-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../core/application/dto/pagination.dto';

@ApiTags('Divisiones')
@Controller('divisiones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DivisionController {
  constructor(
    private readonly divisionService: DivisionService,
  ) {}

  @Post()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Crear una nueva división' })
  @ApiResponse({
    status: 201,
    description: 'División creada exitosamente',
    type: DivisionResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o nombre duplicado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para crear divisiones' })
  async create(@Body() createDivisionDto: CreateDivisionDto): Promise<DivisionResponseDto> {
    return await this.divisionService.create(createDivisionDto);
  }

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todas las divisiones con paginación opcional' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de divisiones obtenida exitosamente',
    type: [DivisionResponseDto]
  })
  async findAll(@Query() pagination: PaginationDto): Promise<DivisionResponseDto[] | PaginatedResponseDto<DivisionResponseDto>> {
    return await this.divisionService.findAll(pagination);
  }

  @Get('dependencia/:dependenciaId')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener divisiones por dependencia' })
  @ApiParam({ name: 'dependenciaId', description: 'ID de la dependencia', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Divisiones obtenidas exitosamente',
    type: [DivisionResponseDto]
  })
  async findByDependencia(@Param('dependenciaId', ParseIntPipe) dependenciaId: number): Promise<DivisionResponseDto[]> {
    return await this.divisionService.findByDependencia(dependenciaId);
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener una división por ID' })
  @ApiParam({ name: 'id', description: 'ID de la división', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'División obtenida exitosamente',
    type: DivisionResponseDto
  })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<DivisionResponseDto> {
    return await this.divisionService.findById(id);
  }

  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Actualizar una división' })
  @ApiParam({ name: 'id', description: 'ID de la división', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'División actualizada exitosamente',
    type: DivisionResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o nombre duplicado' })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para actualizar divisiones' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDivisionDto: UpdateDivisionDto
  ): Promise<DivisionResponseDto> {
    return await this.divisionService.update(id, updateDivisionDto);
  }

  @Delete(':id')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Eliminar una división (soft delete)', 
    description: 'Marca la división como inactiva (estado = false) en lugar de eliminarla permanentemente' 
  })
  @ApiParam({ name: 'id', description: 'ID de la división', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'División marcada como eliminada exitosamente'
  })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  @ApiResponse({ status: 409, description: 'La división ya está marcada como eliminada' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para eliminar divisiones' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.divisionService.delete(id);
    return { message: 'División marcada como eliminada exitosamente' };
  }
}
