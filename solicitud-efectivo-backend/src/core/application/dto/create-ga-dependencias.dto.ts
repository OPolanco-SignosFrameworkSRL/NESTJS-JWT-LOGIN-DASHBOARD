import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateGaDependenciasDto {
  @ApiProperty({
    description: 'Nombre de la dependencia',
    example: 'Recursos Humanos',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  dependencia_nombre: string;

  @ApiProperty({
    description: 'Estado de la dependencia',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
