import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApproveCashRequestDto {
  @ApiProperty({
    description: 'Notas de aprobación/rechazo',
    example: 'Solicitud aprobada para compra de materiales',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
} 