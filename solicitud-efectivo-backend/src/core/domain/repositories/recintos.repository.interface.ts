import { CreateRecintosDto } from '../../application/dto/create-recintos.dto';
import { UpdateRecintosDto } from '../../application/dto/update-recintos.dto';

export interface IRecintosRepository {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  create(createDto: CreateRecintosDto): Promise<any>;
  update(id: number, updateDto: UpdateRecintosDto): Promise<any>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<any>;
}
