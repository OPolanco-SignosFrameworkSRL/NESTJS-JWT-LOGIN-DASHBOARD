import { PartialType } from '@nestjs/swagger';
import { CreateRecintosDto } from './create-recintos.dto';

export class UpdateRecintosDto extends PartialType(CreateRecintosDto) {}
