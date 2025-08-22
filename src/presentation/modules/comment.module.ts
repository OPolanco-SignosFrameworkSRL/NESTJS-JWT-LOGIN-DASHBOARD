import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from '../controllers/comment.controller';
import { CommentEntity } from '../../infrastructure/database/entities/comment.entity';
import { CommentRepository } from '../../infrastructure/repositories/comment.repository';
import { CommentService } from '../../core/domain/services/comment.service';
import { CreateCommentUseCase } from '../../core/application/use-cases/create-comment.use-case';
import { GetCommentsUseCase } from '../../core/application/use-cases/get-comments.use-case';
import { GetUserCommentUseCase } from '../../core/application/use-cases/get-user-comment.use-case';
import { DeleteCommentUseCase } from '../../core/application/use-cases/delete-comment.use-case';
import { CashRequestModule } from './cash-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => CashRequestModule),
  ],
  controllers: [CommentController],
  providers: [
    // Repositorios
    {
      provide: 'CommentRepositoryInterface',
      useClass: CommentRepository,
    },
    // Servicios
    {
      provide: 'CommentServiceInterface',
      useClass: CommentService,
    },
    // Casos de uso
    CreateCommentUseCase,
    GetCommentsUseCase,
    GetUserCommentUseCase,
    DeleteCommentUseCase,
  ],
  exports: [
    'CommentServiceInterface',
    'CommentRepositoryInterface',
  ],
})
export class CommentModule {}
