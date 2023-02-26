import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/modules/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:1001' });
  await app.listen(1000);
}
bootstrap();
