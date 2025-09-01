import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveSolicitudGeneralDto {
  @ApiProperty({
    description: 'Notas o comentarios sobre la aprobación/rechazo',
    example: 'Aprobado para compra de materiales de oficina',
    required: false,
    maxLength: 4000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
} 