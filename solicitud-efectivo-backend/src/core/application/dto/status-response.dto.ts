import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
  @ApiProperty({
    description: 'ID del status',
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: 'Descripción del status',
    example: 'Activo',
  })
  description: string;
}
