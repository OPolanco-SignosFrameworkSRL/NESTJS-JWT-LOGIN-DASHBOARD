import { Injectable, Inject } from '@nestjs/common';
import { CommentServiceInterface } from '../../domain/comment.service.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';

export interface CreateCommentRequest {
  requestId: number;
  comment: string;
  userId: number;
  userCedula: string;
  userRole: string;
}

export interface CreateCommentResponse {
  id: number;
  fechacreado: Date;
  creadoporid: number;
  solicitudid: number;
  creadopor_cedula: string;
  comentario: string;
}

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject('CommentServiceInterface')
    private readonly commentService: CommentServiceInterface,
  ) {}

  async execute(request: CreateCommentRequest): Promise<CreateCommentResponse> {
    const comment = await this.commentService.createOrUpdateComment(
      request.requestId,
      request.userId,
      request.userCedula,
      request.comment,
      request.userRole,
    );

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
