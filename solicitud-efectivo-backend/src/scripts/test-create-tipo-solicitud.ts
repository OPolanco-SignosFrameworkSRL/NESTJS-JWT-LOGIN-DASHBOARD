import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SolicitudDesembolsoWebTiposService } from '../core/domain/services/solicitud-desembolso-web-tipos.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  try {
    const service = app.get(SolicitudDesembolsoWebTiposService);
    const result = await service.create({
      tipoDesc: 'Tipo Prueba Auto',
      tipoIcon: '/AppExt/icons/grid.png',
      produccionFlag: false,
    } as any);
    console.log('✅ Creado:', result);
  } catch (err) {
    console.error('❌ Error en prueba:', err);
  } finally {
    await app.close();
  }
}

run();


