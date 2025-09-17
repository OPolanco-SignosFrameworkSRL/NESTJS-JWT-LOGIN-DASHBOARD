import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class DivisionQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtro de estado: a=activas, i=inactivas', enum: ['a', 'i'] })
  @IsOptional()
  @IsIn(['a', 'i'])
  estado?: 'a' | 'i';
}


