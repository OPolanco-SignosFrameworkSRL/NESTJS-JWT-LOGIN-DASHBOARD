import { Comment } from '../entities/comment.entity';

/**
 * Interfaz del repositorio de comentarios
 * Define los métodos que debe implementar el repositorio de comentarios
 * Un usuario puede tener solo un comentario por solicitud
 */
export interface CommentRepositoryInterface {
  /**
   * Crea un nuevo comentario o actualiza si ya existe
   */
  createOrUpdate(comment: Omit<Comment, 'id'>): Promise<Comment>;

  /**
   * Obtiene el comentario de un usuario específico en una solicitud
   */
  findByUserAndRequest(userId: number, requestId: number): Promise<Comment | null>;

  /**
   * Obtiene todos los comentarios de una solicitud específica
   */
  findByRequestId(requestId: number): Promise<Comment[]>;

  /**
   * Obtiene un comentario por su ID
   */
  findById(id: number): Promise<Comment | null>;

  /**
   * Actualiza un comentario existente
   */
  update(id: number, comment: Partial<Comment>): Promise<Comment | null>;

  /**
   * "Elimina" un comentario marcándolo como vacío
   */
  markAsEmpty(id: number): Promise<Comment | null>;

  /**
   * Verifica si un usuario puede comentar en una solicitud específica
   */
  canUserCommentOnRequest(userId: number, requestId: number, userRole: string): Promise<boolean>;

  /**
   * Obtiene comentarios con información del usuario que los creó
   */
  findCommentsWithUserInfo(requestId: number): Promise<any[]>;
}
