import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsNotEmpty
} from "class-validator";

export class CreateDesembolsoDto {
  @ApiProperty({
    description: "ID de la solicitud de efectivo",
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  solicitud_id: number;

  @ApiProperty({
    description: "ID del responsable del desembolso",
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  responsable_id: number;

  @ApiProperty({
    description: "Monto del desembolso",
    example: 3500,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  monto_desembolso: number;

  @ApiProperty({
    description: "Número de cheque",
    example: "CHK-001",
  })
  @IsString()
  @IsNotEmpty()
  cheque_num: string;

  @ApiProperty({
    description: "Referencia del desembolso",
    example: "REF-001",
    required: false,
  })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({
    description: "Observaciones del desembolso",
    example: "Desembolso por materiales de oficina",
    required: false,
  })
  @IsOptional()
  @IsString()
  observacion?: string;
}