import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class RequestStatusQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtro por descripción (contiene)', example: 'PENDIENTE' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}


