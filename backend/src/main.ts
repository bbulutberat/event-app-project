import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarını da ekleyelim ki Frontend (React) bağlanırken hata almasın
  app.enableCors(); 

  // ESKİSİ MUHTEMELEN ŞÖYLEYDİ: await app.listen(3000);
  
  // YENİSİ BU OLACAK 👇
  // Render bir PORT verirse onu kullan, vermezse (bilgisayarındaysan) 3000'i kullan.
  // '0.0.0.0' kısmı çok önemli, dış dünyaya açılmasını sağlar.
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();