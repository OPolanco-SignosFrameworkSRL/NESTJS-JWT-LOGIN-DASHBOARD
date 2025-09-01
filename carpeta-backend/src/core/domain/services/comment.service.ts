import { Injectable, Inject } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { CommentServiceInterface } from '../comment.service.interface';
import { CommentRepositoryInterface } from '../repositories/comment.repository.interface';
import { ICashRequestRepository } from '../repositories/cash-request.repository.interface';
import { CASH_REQUEST_REPOSITORY } from '../../application/tokens';

@Injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @Inject('CommentRepositoryInterface')
    private readonly commentRepository: CommentRepositoryInterface,
    @Inject(CASH_REQUEST_REPOSITORY)
    private readonly cashRequestRepository: ICashRequestRepository,
  ) {}

  /**
   * Crea o actualiza el comentario de un usuario en una solicitud
   */
  async createOrUpdateComment(
    requestId: number,
    userId: number,
    userCedula: string,
    comment: string,
    userRole: string,
  ): Promise<Comment> {
    // Verificar que el usuario puede comentar en esta solicitud
    console.log('userId', userId);
    console.log('requestId', requestId);
    const canComment = await this.canUserCommentOnRequest(userId, requestId, userRole);
    if (!canComment) {
      throw new Error('No tienes permisos para comentar en esta solicitud');
    }

    // Verificar que la solicitud existe
    const request = await this.cashRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('La solicitud no existe');
    }

    // Crear o actualizar el comentario
    const newComment = new Comment(
      0, // ID será asignado por la base de datos
      new Date(),
      userId,
      requestId,
      userCedula,
      comment,
    );

    return await this.commentRepository.createOrUpdate(newComment);
  }

  /**
   * Obtiene el comentario de un usuario específico en una solicitud
   */
  async getUserCommentByRequest(userId: number, requestId: number): Promise<Comment | null> {
    // Verificar que la solicitud existe
    const request = await this.cashRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('La solicitud no existe');
    }

    return await this.commentRepository.findByUserAndRequest(userId, requestId);
  }

  /**
   * Obtiene todos los comentarios de una solicitud (para admins)
   */
  async getCommentsByRequest(requestId: number): Promise<Comment[]> {
    // Verificar que la solicitud existe
    const request = await this.cashRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('La solicitud no existe');
    }

    return await this.commentRepository.findByRequestId(requestId);
  }

  /**
   * Obtiene un comentario por su ID
   */
  async getCommentById(id: number): Promise<Comment | null> {
    return await this.commentRepository.findById(id);
  }

  /**
   * "Elimina" un comentario marcándolo como vacío
   */
  async deleteComment(id: number, userId: number, userRole: string): Promise<Comment | null> {
    // Obtener el comentario existente
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new Error('El comentario no existe');
    }

    // Verificar permisos: solo el autor puede eliminar (los admins NO pueden eliminar comentarios)
    if (!existingComment.belongsToUser(userId)) {
      throw new Error('No tienes permisos para eliminar este comentario');
    }

    return await this.commentRepository.markAsEmpty(id);
  }

  /**
   * Verifica si un usuario puede comentar en una solicitud
   */
  async canUserCommentOnRequest(userId: number, requestId: number, userRole: string): Promise<boolean> {
    // Los admins pueden comentar en cualquier solicitud
    if (userRole === 'Admin' || userRole === 'Administrator') {
      return true;
    }

    // Los usuarios normales solo pueden comentar en sus propias solicitudes
    const request = await this.cashRequestRepository.findById(requestId);
    if (!request) {
      return false;
    }

    return request.solicitada_porid === userId;
  }

  /**
   * Obtiene comentarios con información del usuario
   */
  async getCommentsWithUserInfo(requestId: number): Promise<any[]> {
    return await this.commentRepository.findCommentsWithUserInfo(requestId);
  }
}
