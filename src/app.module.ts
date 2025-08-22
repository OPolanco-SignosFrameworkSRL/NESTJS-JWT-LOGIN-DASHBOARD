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
import { AppController } from './app.controller';
import { getDatabaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
