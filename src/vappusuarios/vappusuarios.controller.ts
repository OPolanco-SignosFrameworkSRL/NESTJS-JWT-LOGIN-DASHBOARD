import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VappusuariosService } from './vappusuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('vappusuarios')
@Controller('vappusuarios')
export class VappusuariosController {
  constructor(private readonly vappusuariosService: VappusuariosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener todos los usuarios de la vista',
    description: 'Obtiene todos los usuarios de la vista [dbo].[vappusuarios] (requiere JWT)'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          cedula: { type: 'string', example: '00104168786' },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          codigo: { type: 'string', example: 'cng0grHUAxFiIiDcJSD6BA==' },
          valido: { type: 'number', example: 1 }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  findAll() {
    return this.vappusuariosService.findAll();
  }
}
