import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
  logger.log(`Server is listening on port ${port}`, 'main.ts');
}
bootstrap();
