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
    description: 'Estado del recinto (1=Válido, 2=Inválido)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  estado?: number;
}
