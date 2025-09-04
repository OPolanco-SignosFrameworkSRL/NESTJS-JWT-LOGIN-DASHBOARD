import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { StatusService } from '../../core/domain/services/status.service';
import { StatusEntity } from '../../infrastructure/database/entities/status.entity';
import { StandardResponseDto } from '../../core/application/dto/standard-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Status')
@Controller('status')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener todos los status',
    description: 'Retorna una lista de todos los status disponibles en el sistema.' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de status obtenida exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(StandardResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(StatusEntity) }
            }
          }
        }
      ]
    }
  })
  async findAll(): Promise<StatusEntity[]> {
    return this.statusService.getAllStatus();
  }

  @Get('active')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener status activos',
    description: 'Retorna una lista de status con char_status = "A".' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de status activos obtenida exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(StandardResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(StatusEntity) }
            }
          }
        }
      ]
    }
  })
  async findActive(): Promise<StatusEntity[]> {
    return this.statusService.getActiveStatus();
  }

  @Get('inactive')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener status inactivos',
    description: 'Retorna una lista de status con char_status = "I".' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de status inactivos obtenida exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(StandardResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(StatusEntity) }
            }
          }
        }
      ]
    }
  })
  async findInactive(): Promise<StatusEntity[]> {
    return this.statusService.getInactiveStatus();
  }

  @Get(':id')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener status por ID',
    description: 'Retorna un status específico por su ID.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del status',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status encontrado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(StandardResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(StatusEntity) }
          }
        }
      ]
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Status no encontrado' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StatusEntity> {
    return this.statusService.getStatusById(id);
  }
}
