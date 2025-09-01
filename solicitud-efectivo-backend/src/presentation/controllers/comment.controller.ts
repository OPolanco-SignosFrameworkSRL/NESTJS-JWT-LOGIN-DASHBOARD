import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateCommentDto } from '../../core/application/dto/create-comment.dto';
import { CreateCommentUseCase } from '../../core/application/use-cases/create-comment.use-case';
import { GetCommentsUseCase } from '../../core/application/use-cases/get-comments.use-case';
import { GetUserCommentUseCase } from '../../core/application/use-cases/get-user-comment.use-case';
import { DeleteCommentUseCase } from '../../core/application/use-cases/delete-comment.use-case';

@ApiTags('Comentarios')
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsUseCase: GetCommentsUseCase,
    private readonly getUserCommentUseCase: GetUserCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo comentario' })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        fechacreado: { type: 'string', format: 'date-time', example: '2024-01-10T08:00:00.000Z' },
        creadoporid: { type: 'number', example: 1 },
        solicitudid: { type: 'number', example: 1 },
        creadopor_cedula: { type: 'string', example: '12345678' },
        comentario: { type: 'string', example: 'Este es un comentario' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos para comentar en esta solicitud' })
  async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    try {
      const user = req.user;
      
      // Debug: ver qué está llegando en req.user
      console.log('🔍 Debug - req.user completo:', JSON.stringify(req.user, null, 2));
      console.log('🔍 Debug - user.id:', user?.id);
      console.log('🔍 Debug - user.cedula:', user?.cedula);
      console.log('🔍 Debug - user.role:', user?.role);
      
      const result = await this.createCommentUseCase.execute({
        requestId: createCommentDto.requestId,
        comment: createCommentDto.comment,
        userId: user.id,
        userCedula: user.cedula,
        userRole: user.role,
      });

      return {
        success: true,
        message: 'Comentario creado exitosamente',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al crear el comentario',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:requestId')
  @ApiOperation({ summary: 'Obtener el comentario del usuario actual en una solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Comentario del usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        fechacreado: { type: 'string', format: 'date-time', example: '2024-01-10T08:00:00.000Z' },
        creadoporid: { type: 'number', example: 1 },
        solicitudid: { type: 'number', example: 1 },
        creadopor_cedula: { type: 'string', example: '12345678' },
        comentario: { type: 'string', example: 'Este es un comentario' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async getUserComment(@Param('requestId', ParseIntPipe) requestId: number, @Request() req) {
    try {
      const user = req.user;
      const comment = await this.getUserCommentUseCase.execute({ 
        requestId, 
        userId: user.id 
      });

      return {
        success: true,
        message: comment ? 'Comentario obtenido exitosamente' : 'No hay comentario para este usuario',
        data: comment,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al obtener el comentario',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('request/:requestId')
  @ApiOperation({ summary: 'Obtener todos los comentarios de una solicitud (solo para admins)' })
  @ApiResponse({
    status: 200,
    description: 'Comentarios obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          fechacreado: { type: 'string', format: 'date-time', example: '2024-01-10T08:00:00.000Z' },
          creadoporid: { type: 'number', example: 1 },
          solicitudid: { type: 'number', example: 1 },
          creadopor_cedula: { type: 'string', example: '12345678' },
          comentario: { type: 'string', example: 'Este es un comentario' },
          usuario: {
            type: 'object',
            properties: {
              nombre: { type: 'string', example: 'Juan' },
              apellido: { type: 'string', example: 'Pérez' },
              email: { type: 'string', example: 'juan.perez@empresa.com' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo para administradores' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async getCommentsByRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    try {
      const comments = await this.getCommentsUseCase.execute({ requestId });

      return {
        success: true,
        message: 'Comentarios obtenidos exitosamente',
        data: comments,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al obtener los comentarios',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un comentario (solo el autor puede eliminar)' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Comentario eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos para eliminar este comentario (solo el autor puede eliminar)' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      const user = req.user;
      
      const result = await this.deleteCommentUseCase.execute({
        id,
        userId: user.id,
        userRole: user.role,
      });

      return {
        success: result.success,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Error al eliminar el comentario',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
