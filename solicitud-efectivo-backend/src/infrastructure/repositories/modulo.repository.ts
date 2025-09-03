import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ModuloEntity } from '../database/entities/modulo.entity';

@Injectable()
export class ModuloRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findByName(moduleName: string): Promise<ModuloEntity | null> {
    const repository = this.dataSource.getRepository(ModuloEntity);
    return repository.findOne({
      where: { Modulo: moduleName, RowActive: true }
    });
  }

  async create(moduleName: string, userId: number): Promise<ModuloEntity> {
    const repository = this.dataSource.getRepository(ModuloEntity);
    const modulo = repository.create({
      Modulo: moduleName,
      RowActive: true,
      UserAdd: userId
    });
    return repository.save(modulo);
  }

  async findOrCreate(moduleName: string, userId: number): Promise<ModuloEntity> {
    const existing = await this.findByName(moduleName);
    if (existing) {
      return existing;
    }
    return this.create(moduleName, userId);
  }
}