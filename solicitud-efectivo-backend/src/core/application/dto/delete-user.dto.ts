import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    description: 'Confirmación de eliminación permanente',
    example: true,
    required: true,
  })
  @IsBoolean()
  confirmPermanentDelete: boolean;

  @ApiProperty({
    description: 'Razón de la eliminación',
    example: 'Usuario ya no trabaja en la empresa',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Confirmar que se entiende que la acción no se puede deshacer',
    example: 'SI, ELIMINAR PERMANENTEMENTE',
    required: true,
  })
  @IsString()
  confirmText: string;
} 