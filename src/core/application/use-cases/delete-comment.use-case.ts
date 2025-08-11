import { Injectable, Inject } from '@nestjs/common';
import { CommentServiceInterface } from '../../domain/comment.service.interface';

export interface DeleteCommentRequest {
  id: number;
  userId: number;
  userRole: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    fechacreado: Date;
    creadoporid: number;
    solicitudid: number;
    creadopor_cedula: string;
    comentario: string;
  };
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject('CommentServiceInterface')
    private readonly commentService: CommentServiceInterface,
  ) {}

  async execute(request: DeleteCommentRequest): Promise<DeleteCommentResponse> {
    const comment = await this.commentService.deleteComment(
      request.id,
      request.userId,
      request.userRole,
    );

    if (!comment) {
      return {
        success: false,
        message: 'No se pudo eliminar el comentario',
      };
    }

    return {
      success: true,
      message: 'Comentario eliminado exitosamente',
      data: {
        id: comment.id,
        fechacreado: comment.fechacreado,
        creadoporid: comment.creadoporid,
        solicitudid: comment.solicitudid,
        creadopor_cedula: comment.creadopor_cedula,
        comentario: comment.comentario,
      },
    };
  }
}
