import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RecintosService } from '../../core/domain/services/recintos.service';
import { CreateRecintosDto } from '../../core/application/dto/create-recintos.dto';
import { UpdateRecintosDto } from '../../core/application/dto/update-recintos.dto';
import { RecintosResponseDto } from '../../core/application/dto/recintos-response.dto';

@ApiTags('Recintos')
@Controller('recintos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RecintosController {
  constructor(
    private readonly recintosService: RecintosService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todos los recintos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recintos obtenida exitosamente',
    type: [RecintosResponseDto]
  })
  async findAll(): Promise<RecintosResponseDto[]> {
    return await this.recintosService.findAll();
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un recinto por ID' })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto obtenido exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<RecintosResponseDto> {
    return await this.recintosService.findById(id);
  }

  @Post()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Crear un nuevo recinto' })
  @ApiResponse({
    status: 201,
    description: 'Recinto creado exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 409, description: 'Ya existe un recinto con ese nombre' })
  async create(@Body() createDto: CreateRecintosDto): Promise<RecintosResponseDto> {
    return await this.recintosService.create(createDto);
  }

  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Actualizar un recinto' })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto actualizado exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un recinto con ese nombre' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRecintosDto
  ): Promise<RecintosResponseDto> {
    return await this.recintosService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Eliminar un recinto' })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.recintosService.delete(id);
    return { message: 'Recinto eliminado exitosamente' };
  }
}
