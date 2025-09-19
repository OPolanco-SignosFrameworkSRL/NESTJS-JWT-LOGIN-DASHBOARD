import { Injectable, Inject } from '@nestjs/common';
import { CommentServiceInterface } from '../../domain/comment.service.interface';

export interface GetCommentsRequest {
  requestId: number;
}

export interface GetCommentsResponse {
  id: number;
  fechacreado: Date;
  creadoporid: number;
  solicitudid: number;
  creadopor_cedula: string;
  comentario: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email?: string;
  };
}

@Injectable()
export class GetCommentsUseCase {
  constructor(
    @Inject('CommentServiceInterface')
    private readonly commentService: CommentServiceInterface,
  ) {}

  async execute(request: GetCommentsRequest): Promise<GetCommentsResponse[]> {
    const comments = await this.commentService.getCommentsWithUserInfo(request.requestId);

    return comments.map(comment => ({
      id: comment.id,
      fechacreado: comment.fechacreado,
      creadoporid: comment.creadoporid,
      solicitudid: comment.solicitudid,
      creadopor_cedula: comment.creadopor_cedula,
      comentario: comment.comentario,
      usuario: comment.usuario,
    }));
  }
}
