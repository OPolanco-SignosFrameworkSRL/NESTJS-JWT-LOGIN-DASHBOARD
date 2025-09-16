import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreateDivisionDto {
  @ApiProperty({
    description: 'Nombre de la división',
    example: 'Tecnología',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    description: 'ID de la dependencia',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  dependencia_id: number;

  @ApiProperty({
    description: 'Estado de la división (1=Activa, 2=Inactiva)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  estado?: number;
}
