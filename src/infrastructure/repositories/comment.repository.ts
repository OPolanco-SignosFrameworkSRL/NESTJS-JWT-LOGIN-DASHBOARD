import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { CommentRepositoryInterface } from '../../core/domain/repositories/comment.repository.interface';
import { Comment } from '../../core/domain/entities/comment.entity';

@Injectable()
export class CommentRepository implements CommentRepositoryInterface {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  /**
   * Crea un nuevo comentario o actualiza si ya existe
   */
  async createOrUpdate(comment: Omit<Comment, 'id'>): Promise<Comment> {
    // Buscar si ya existe un comentario del usuario en esta solicitud
    const existingComment = await this.commentRepository.findOne({
      where: {
        creadoporid: comment.creadoporid,
        solicitudid: comment.solicitudid,
      },
    });

    if (existingComment) {
      // Actualizar el comentario existente
      existingComment.comentario = comment.comentario;
      existingComment.fechacreado = comment.fechacreado;
      
      const updatedComment = await this.commentRepository.save(existingComment);
      
      return new Comment(
        updatedComment.id,
        updatedComment.fechacreado,
        updatedComment.creadoporid,
        updatedComment.solicitudid,
        updatedComment.creadopor_cedula,
        updatedComment.comentario,
      );
    } else {
      // Crear un nuevo comentario
      const commentEntity = this.commentRepository.create({
        fechacreado: comment.fechacreado,
        creadoporid: comment.creadoporid,
        solicitudid: comment.solicitudid,
        creadopor_cedula: comment.creadopor_cedula,
        comentario: comment.comentario,
      });

      const savedComment = await this.commentRepository.save(commentEntity);
      
      return new Comment(
        savedComment.id,
        savedComment.fechacreado,
        savedComment.creadoporid,
        savedComment.solicitudid,
        savedComment.creadopor_cedula,
        savedComment.comentario,
      );
    }
  }

  /**
   * Obtiene el comentario de un usuario específico en una solicitud
   */
  async findByUserAndRequest(userId: number, requestId: number): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: {
        creadoporid: userId,
        solicitudid: requestId,
      },
    });

    if (!comment) {
      return null;
    }

    return new Comment(
      comment.id,
      comment.fechacreado,
      comment.creadoporid,
      comment.solicitudid,
      comment.creadopor_cedula,
      comment.comentario,
    );
  }

  /**
   * Obtiene todos los comentarios de una solicitud específica
   */
  async findByRequestId(requestId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { solicitudid: requestId },
      order: { fechacreado: 'DESC' },
    });

    return comments.map(comment => new Comment(
      comment.id,
      comment.fechacreado,
      comment.creadoporid,
      comment.solicitudid,
      comment.creadopor_cedula,
      comment.comentario,
    ));
  }

  /**
   * Obtiene un comentario por su ID
   */
  async findById(id: number): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      return null;
    }

    return new Comment(
      comment.id,
      comment.fechacreado,
      comment.creadoporid,
      comment.solicitudid,
      comment.creadopor_cedula,
      comment.comentario,
    );
  }

  /**
   * Actualiza un comentario existente
   */
  async update(id: number, comment: Partial<Comment>): Promise<Comment | null> {
    const existingComment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!existingComment) {
      return null;
    }

    // Actualizar solo los campos proporcionados
    if (comment.comentario !== undefined) {
      existingComment.comentario = comment.comentario;
    }

    const updatedComment = await this.commentRepository.save(existingComment);

    return new Comment(
      updatedComment.id,
      updatedComment.fechacreado,
      updatedComment.creadoporid,
      updatedComment.solicitudid,
      updatedComment.creadopor_cedula,
      updatedComment.comentario,
    );
  }

  /**
   * "Elimina" un comentario marcándolo como vacío
   */
  async markAsEmpty(id: number): Promise<Comment | null> {
    const existingComment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!existingComment) {
      return null;
    }

    // Marcar como vacío en lugar de eliminar
    existingComment.comentario = '';
    
    const updatedComment = await this.commentRepository.save(existingComment);

    return new Comment(
      updatedComment.id,
      updatedComment.fechacreado,
      updatedComment.creadoporid,
      updatedComment.solicitudid,
      updatedComment.creadopor_cedula,
      updatedComment.comentario,
    );
  }

  /**
   * Verifica si un usuario puede comentar en una solicitud específica
   */
  async canUserCommentOnRequest(userId: number, requestId: number, userRole: string): Promise<boolean> {
    // Los admins pueden comentar en cualquier solicitud
    if (userRole === 'Admin' || userRole === 'Administrator') {
      return true;
    }

    // Para usuarios normales, verificamos si la solicitud pertenece al usuario
    // Esta lógica se maneja en el servicio, pero aquí podríamos hacer una consulta adicional si es necesario
    return true; // La validación principal se hace en el servicio
  }

  /**
   * Obtiene comentarios con información del usuario que los creó
   */
  async findCommentsWithUserInfo(requestId: number): Promise<any[]> {
    // Obtener solo los comentarios básicos sin joins que no existen
    const comments = await this.commentRepository.find({
      where: { solicitudid: requestId },
      order: { fechacreado: 'DESC' },
    });

    return comments.map(comment => ({
      id: comment.id,
      fechacreado: comment.fechacreado,
      creadoporid: comment.creadoporid,
      solicitudid: comment.solicitudid,
      creadopor_cedula: comment.creadopor_cedula,
      comentario: comment.comentario,
      // Información básica del usuario (solo ID y cédula)
      usuario: {
        id: comment.creadoporid,
        cedula: comment.creadopor_cedula,
        // Los campos nombre, apellido y email no están disponibles en esta tabla
        // Se pueden obtener por separado si es necesario
      },
    }));
  }
}
