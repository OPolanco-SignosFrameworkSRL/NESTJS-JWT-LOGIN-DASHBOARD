import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { RoleEntity } from '../../infrastructure/database/entities/role.entity';
import { RoleRepository } from '../../infrastructure/repositories/role.repository';

// Domain
import { RolesService } from '../../core/domain/services/roles.service';

// Application
import { CreateRoleUseCase } from '../../core/application/use-cases/create-role.use-case';
import { GetRolesUseCase } from '../../core/application/use-cases/get-roles.use-case';
import { GetRoleByIdUseCase } from '../../core/application/use-cases/get-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../core/application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../../core/application/use-cases/delete-role.use-case';
//import { GetRoleStatsUseCase } from '../../core/application/use-cases/get-role-stats.use-case';

// Presentation
import { RolesController } from '../controllers/roles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [RolesController],
  providers: [
    // Repository Provider
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
    
    // Domain Services
    RolesService,
    
    // Use Cases
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    //GetRoleStatsUseCase,
  ],
  exports: [
    RolesService,
    'IRoleRepository',
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    //GetRoleStatsUseCase,
  ],
})
export class RolesModule {}
