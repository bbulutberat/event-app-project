import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- BU EKLENDİ
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity'; // <--- BU EKLENDİ

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // <--- KRİTİK NOKTA BURASI
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}