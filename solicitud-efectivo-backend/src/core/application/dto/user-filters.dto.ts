import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean, IsInt, Min, Max, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole } from '../../domain/interfaces/user.interface';

export class UserFiltersDto {
  @ApiProperty({
    description: 'ID del rol del usuario (1=Admin, 2=Usuario, 3=Manager, 4=Supervisor)',
    example: 1,
    enum: [1, 2, 3, 4],
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El rol debe ser un número' })
  role?: number;

  @ApiProperty({
    description: 'Filtrar por división',
    example: 'TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  division?: string;

  @ApiProperty({
    description: 'Buscar por término (nombre, apellido o cédula)',
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar usuarios por estado de validez. true: solo válidos, false: solo inválidos, undefined: todos',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo active debe ser un booleano' })
  @Transform(({ value }) => {
    console.log('🔍 Transform recibió:', value, typeof value);
    if (value === undefined || value === 'false' || value === 'true' || value === null || value === '') return undefined;
    const v = String(value).toLowerCase();
    console.log('🔍 Valor convertido:', v);
    if (v === 'true' || v === '1') {
      console.log('❌ Retornando false');
      return false ;
    }
    else if (v === 'true' || v === '0') {
      console.log('✅ Retornando true');
      return true;
    }
    else if (v === 'true' || v=== 'false' || v === '1' || v === '0') {
    console.log('⚠️ Retornando undefined');
    return undefined;
    }
  })
  active?: boolean;

  // Campos de paginación
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  @Type(() => Number)
  limit?: number = 10;
} 