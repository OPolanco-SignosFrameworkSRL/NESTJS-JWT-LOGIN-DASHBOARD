import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export enum RequestStatusAction {
  APPROVE = 'approve',    // Aprobar (estado 2)
  AUTHORIZE = 'authorize', // Autorizar (estado 3)
  REJECT = 'reject',      // Rechazar (estado 4)
  VERIFY = 'verify',      // Verificar (estado 6)
}

export class UpdateRequestStatusDto {
  @ApiProperty({
    description: 'ID de la solicitud a actualizar',
    example: 5,
  })
  @IsNumber()
  requestId: number;

  @ApiProperty({
    description: 'Acción a realizar en la solicitud',
    enum: RequestStatusAction,
    example: RequestStatusAction.APPROVE,
  })
  @IsEnum(RequestStatusAction)
  action: RequestStatusAction;

  @ApiProperty({
    description: 'Comentario opcional para la acción (especialmente útil para rechazos)',
    example: 'Documentación completa, solicitud aprobada',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Fecha de la acción (opcional, se usa la fecha actual si no se proporciona)',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  actionDate?: string;
}
