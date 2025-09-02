import { Comment } from './entities/comment.entity';

/**
 * Interfaz del servicio de comentarios
 * Define los métodos que debe implementar el servicio de comentarios
 * Un usuario puede tener solo un comentario por solicitud
 */
export interface CommentServiceInterface {
  /**
   * Crea o actualiza el comentario de un usuario en una solicitud
   */
  createOrUpdateComment(
    requestId: number,
    userId: number,
    userCedula: string,
    comment: string,
    userRole: string,
  ): Promise<Comment>;

  /**
   * Obtiene el comentario de un usuario específico en una solicitud
   */
  getUserCommentByRequest(userId: number, requestId: number): Promise<Comment | null>;

  /**
   * Obtiene todos los comentarios de una solicitud (para admins)
   */
  getCommentsByRequest(requestId: number): Promise<Comment[]>;

  /**
   * Obtiene un comentario por su ID
   */
  getCommentById(id: number): Promise<Comment | null>;

  /**
   * "Elimina" un comentario marcándolo como vacío
   */
  deleteComment(id: number, userId: number, userRole: string): Promise<Comment | null>;

  /**
   * Verifica si un usuario puede comentar en una solicitud
   */
  canUserCommentOnRequest(userId: number, requestId: number, userRole: string): Promise<boolean>;

  /**
   * Obtiene comentarios con información del usuario
   */
  getCommentsWithUserInfo(requestId: number): Promise<any[]>;
}
