import { PartialType } from '@nestjs/swagger';
import { CreateGaDependenciasDto } from './create-ga-dependencias.dto';

export class UpdateGaDependenciasDto extends PartialType(CreateGaDependenciasDto) {}
