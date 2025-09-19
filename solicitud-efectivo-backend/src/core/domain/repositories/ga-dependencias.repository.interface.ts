import { CreateGaDependenciasDto } from '../../application/dto/create-ga-dependencias.dto';
import { UpdateGaDependenciasDto } from '../../application/dto/update-ga-dependencias.dto';

export interface IGaDependenciasRepository {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  create(createDto: CreateGaDependenciasDto): Promise<any>;
  update(id: number, updateDto: UpdateGaDependenciasDto): Promise<any>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<any>;
}
