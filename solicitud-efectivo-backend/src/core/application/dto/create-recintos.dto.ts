import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateRecintosDto {
  @ApiProperty({
    description: 'Nombre del recinto',
    example: 'Sala de Conferencias A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  recinto: string;

  @ApiProperty({
    description: 'Ubicación del recinto',
    example: 'Edificio Principal, Piso 2, Oficina 201',
  })
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @ApiProperty({
    description: 'Estado del recinto (0=Inactivo, 1=Activo)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  estado?: number;
}
