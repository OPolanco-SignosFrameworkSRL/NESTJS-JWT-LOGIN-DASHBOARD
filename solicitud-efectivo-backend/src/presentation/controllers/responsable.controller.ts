import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ResponsableService } from '../../core/domain/services/responsable.service';
import { ResponsableResponseDto } from '../../core/application/dto/responsable-response.dto';

@ApiTags('Responsables')
@Controller('responsables')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ResponsableController {
  constructor(
    private readonly responsableService: ResponsableService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todos los responsables' })
  @ApiResponse({
    status: 200,
    description: 'Lista de responsables obtenida exitosamente',
    type: [ResponsableResponseDto]
  })
  async findAll(): Promise<ResponsableResponseDto[]> {
    return await this.responsableService.findAll();
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un responsable por ID' })
  @ApiParam({ name: 'id', description: 'ID del responsable', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Responsable obtenido exitosamente',
    type: ResponsableResponseDto
  })
  @ApiResponse({ status: 404, description: 'Responsable no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ResponsableResponseDto> {
    return await this.responsableService.findById(id);
  }
}