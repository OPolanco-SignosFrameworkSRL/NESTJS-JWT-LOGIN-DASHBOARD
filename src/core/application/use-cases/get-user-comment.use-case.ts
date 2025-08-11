import { Injectable, Inject } from '@nestjs/common';
import { CommentServiceInterface } from '../../domain/comment.service.interface';

export interface GetUserCommentRequest {
  requestId: number;
  userId: number;
}

export interface GetUserCommentResponse {
  id: number;
  fechacreado: Date;
  creadoporid: number;
  solicitudid: number;
  creadopor_cedula: string;
  comentario: string;
}

@Injectable()
export class GetUserCommentUseCase {
  constructor(
    @Inject('CommentServiceInterface')
    private readonly commentService: CommentServiceInterface,
  ) {}

  async execute(request: GetUserCommentRequest): Promise<GetUserCommentResponse | null> {
    const comment = await this.commentService.getUserCommentByRequest(request.userId, request.requestId);

    if (!comment) {
      return null;
    }

    return {
      id: comment.id,
      fechacreado: comment.fechacreado,
      creadoporid: comment.creadoporid,
      solicitudid: comment.solicitudid,
      creadopor_cedula: comment.creadopor_cedula,
      comentario: comment.comentario,
    };
  }
}
