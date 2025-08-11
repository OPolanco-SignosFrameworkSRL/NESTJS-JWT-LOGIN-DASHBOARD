import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID de la solicitud a la que se agregará el comentario',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  requestId: number;

  @ApiProperty({
    description: 'Contenido del comentario (se creará o actualizará el comentario del usuario)',
    example: 'Este es un comentario sobre la solicitud de efectivo',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000, { message: 'El comentario no puede exceder los 4000 caracteres' })
  comment: string;
}
