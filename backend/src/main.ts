import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // React'in bağlanmasına izin ver (CORS)
  app.enableCors(); 
  
  await app.listen(3000);
}
bootstrap();