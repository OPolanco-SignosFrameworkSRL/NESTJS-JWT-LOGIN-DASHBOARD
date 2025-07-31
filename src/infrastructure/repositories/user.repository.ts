import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { UserWriteEntity } from '../database/entities/user-write.entity';
import { IUserRepository, IUserWriteRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserWrite } from '../../domain/entities/user-write.entity';
import { UserRole } from '../../domain/interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { valido: '1' },
      order: { nombre: 'ASC' },
    });

    return users.map(user => new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    ));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, valido: '1' },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    );
  }

  async findByCedula(cedula: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { cedula, valido: '1' },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    );
  }

  async findByRole(role: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { role, valido: '1' },
      order: { nombre: 'ASC' },
    });

    return users.map(user => new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    ));
  }

  async findByDivision(division: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { division, valido: '1' },
      order: { nombre: 'ASC' },
    });

    return users.map(user => new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    ));
  }

  async searchByTerm(term: string): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.valido = :valido', { valido: '1' })
      .andWhere(
        '(user.nombre LIKE :term OR user.apellido LIKE :term OR user.cedula LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('user.nombre', 'ASC')
      .getMany();

    return users.map(user => new User(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.role,
      user.user_email,
      user.telefono,
      user.valido,
      user.division,
      user.cargo,
      user.dependencia,
      user.recinto,
      user.estado,
    ));
  }

  async getStats(): Promise<any> {
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('user.valido = :valido', { valido: '1' })
      .groupBy('user.role')
      .getRawMany();

    const usersByDivision = await this.userRepository
      .createQueryBuilder('user')
      .select('user.division', 'division')
      .addSelect('COUNT(*)', 'count')
      .where('user.valido = :valido', { valido: '1' })
      .groupBy('user.division')
      .getRawMany();

    const totalUsers = await this.userRepository.count({
      where: { valido: '1' },
    });

    return {
      totalUsers,
      usersByRole,
      usersByDivision,
    };
  }

  async exists(cedula: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { cedula, valido: '1' },
    });
    return count > 0;
  }
}

@Injectable()
export class UserWriteRepository implements IUserWriteRepository {
  constructor(
    @InjectRepository(UserWriteEntity)
    private readonly userWriteRepository: Repository<UserWriteEntity>,
  ) {}

  async findById(id: number): Promise<UserWrite | null> {
    const user = await this.userWriteRepository.findOne({
      where: { id },
    });

    if (!user) return null;

    return new UserWrite(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.password,
      user.role,
      user.user_email,
      user.telefono,
      user.direccion,
      user.celular,
      user.user_status,
      user.caja_id,
      user.tienda_id,
      user.allow_multi_tienda,
      user.max_descuento,
      user.close_caja,
      user.lastlogindatetime,
      user.lastloginip,
      user.user_ip,
      user.user_account_email,
      user.user_account_email_passw,
      user.comision_porciento,
      user.default_portalid,
      user.nuevocampo,
      user.encargadoId,
      user.passwchanged,
      user.valido,
    );
  }

  async findByCedula(cedula: string): Promise<UserWrite | null> {
    const user = await this.userWriteRepository.findOne({
      where: { cedula },
    });

    if (!user) return null;

    return new UserWrite(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.password,
      user.role,
      user.user_email,
      user.telefono,
      user.direccion,
      user.celular,
      user.user_status,
      user.caja_id,
      user.tienda_id,
      user.allow_multi_tienda,
      user.max_descuento,
      user.close_caja,
      user.lastlogindatetime,
      user.lastloginip,
      user.user_ip,
      user.user_account_email,
      user.user_account_email_passw,
      user.comision_porciento,
      user.default_portalid,
      user.nuevocampo,
      user.encargadoId,
      user.passwchanged,
      user.valido,
    );
  }

  async create(userData: Partial<UserWrite>): Promise<UserWrite> {
    const user = this.userWriteRepository.create(userData);
    const savedUser = await this.userWriteRepository.save(user);

    return new UserWrite(
      savedUser.id,
      savedUser.cedula,
      savedUser.nombre,
      savedUser.apellido,
      savedUser.codigo,
      savedUser.password,
      savedUser.role,
      savedUser.user_email,
      savedUser.telefono,
      savedUser.direccion,
      savedUser.celular,
      savedUser.user_status,
      savedUser.caja_id,
      savedUser.tienda_id,
      savedUser.allow_multi_tienda,
      savedUser.max_descuento,
      savedUser.close_caja,
      savedUser.lastlogindatetime,
      savedUser.lastloginip,
      savedUser.user_ip,
      savedUser.user_account_email,
      savedUser.user_account_email_passw,
      savedUser.comision_porciento,
      savedUser.default_portalid,
      savedUser.nuevocampo,
      savedUser.encargadoId,
      savedUser.passwchanged,
      savedUser.valido,
    );
  }

  async update(id: number, userData: Partial<UserWrite>): Promise<UserWrite> {
    await this.userWriteRepository.update(id, userData);
    const updatedUser = await this.userWriteRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    return new UserWrite(
      updatedUser.id,
      updatedUser.cedula,
      updatedUser.nombre,
      updatedUser.apellido,
      updatedUser.codigo,
      updatedUser.password,
      updatedUser.role,
      updatedUser.user_email,
      updatedUser.telefono,
      updatedUser.direccion,
      updatedUser.celular,
      updatedUser.user_status,
      updatedUser.caja_id,
      updatedUser.tienda_id,
      updatedUser.allow_multi_tienda,
      updatedUser.max_descuento,
      updatedUser.close_caja,
      updatedUser.lastlogindatetime,
      updatedUser.lastloginip,
      updatedUser.user_ip,
      updatedUser.user_account_email,
      updatedUser.user_account_email_passw,
      updatedUser.comision_porciento,
      updatedUser.default_portalid,
      updatedUser.nuevocampo,
      updatedUser.encargadoId,
      updatedUser.passwchanged,
      updatedUser.valido,
    );
  }

  async delete(id: number): Promise<void> {
    const user = await this.userWriteRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    await this.userWriteRepository.remove(user);
  }

  async findAll(): Promise<UserWrite[]> {
    const users = await this.userWriteRepository.find({
      order: { id: 'DESC' },
    });

    return users.map(user => new UserWrite(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.password,
      user.role,
      user.user_email,
      user.telefono,
      user.direccion,
      user.celular,
      user.user_status,
      user.caja_id,
      user.tienda_id,
      user.allow_multi_tienda,
      user.max_descuento,
      user.close_caja,
      user.lastlogindatetime,
      user.lastloginip,
      user.user_ip,
      user.user_account_email,
      user.user_account_email_passw,
      user.comision_porciento,
      user.default_portalid,
      user.nuevocampo,
      user.encargadoId,
      user.passwchanged,
      user.valido,
    ));
  }

  async findByValido(valido: string): Promise<UserWrite[]> {
    const users = await this.userWriteRepository.find({
      where: { valido },
      order: { id: 'DESC' },
    });

    return users.map(user => new UserWrite(
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.codigo,
      user.password,
      user.role,
      user.user_email,
      user.telefono,
      user.direccion,
      user.celular,
      user.user_status,
      user.caja_id,
      user.tienda_id,
      user.allow_multi_tienda,
      user.max_descuento,
      user.close_caja,
      user.lastlogindatetime,
      user.lastloginip,
      user.user_ip,
      user.user_account_email,
      user.user_account_email_passw,
      user.comision_porciento,
      user.default_portalid,
      user.nuevocampo,
      user.encargadoId,
      user.passwchanged,
      user.valido,
    ));
  }
} 