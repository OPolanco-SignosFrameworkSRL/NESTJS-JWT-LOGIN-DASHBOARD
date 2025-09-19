import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class DivisionQueryDto extends PaginationDto {
/*   @ApiPropertyOptional({ description: 'Filtro de estado: a=activas, i=inactivas', enum: ['a', 'i'] })
  @IsOptional()
  @IsIn(['a', 'i'])
  estado?: 'a' | 'i'; */

  @ApiPropertyOptional({ 
    description: 'Filtrar por status de división (1=Activas, 2=Inactivas)',
    enum: [1, 2],
    example: 1
  })
  @IsOptional()
  @IsIn([1, 2])
  statusId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de división',
    example: 'TI'
  })
  @IsOptional()
  division?: string;

  @ApiPropertyOptional({
    description: 'Buscar por término (nombre de división)',
    example: 'Administración'
  })
  @IsOptional()
  search?: string;
}


