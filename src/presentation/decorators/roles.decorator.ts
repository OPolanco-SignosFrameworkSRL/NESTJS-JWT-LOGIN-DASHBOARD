import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../core/domain/user.interface';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 