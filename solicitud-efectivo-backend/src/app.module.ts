import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './presentation/modules/auth.module';
import { UsersModule } from './presentation/modules/users.module';
import { RolesModule } from './presentation/modules/roles.module';
import { CashRequestModule } from './presentation/modules/cash-request.module';
import { SolicitudGeneralModule } from './presentation/modules/solicitud-general.module';
import { CommentModule } from './presentation/modules/comment.module';
import { DesembolsoModule } from './presentation/modules/desembolso.module';
import { AdminRequestModule } from './presentation/modules/admin-request.module';
import { ModulosPermisosModule } from './presentation/modules/modulos-permisos.module';
import { SolicitudEfectivoModule } from './presentation/modules/solicitud-efectivo.module';
import { StatusModule } from './presentation/modules/status.module';
import { AppController } from './app.controller';
import { getDatabaseConfig } from './config/database.config';
import { appConfig, jwtConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CashRequestModule,
    SolicitudGeneralModule,
    CommentModule,
    DesembolsoModule,
    AdminRequestModule,
    ModulosPermisosModule,
    SolicitudEfectivoModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
