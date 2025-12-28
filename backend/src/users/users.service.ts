import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  // GÜNCELLENDİ: Hem mail hem telefon ile giriş kontrolü
  async login(identifier: string, pass: string) {
    // Kullanıcıyı E-posta VEYA Telefon numarası ile bul
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier, password: pass },
        { phoneNumber: identifier, password: pass }
      ]
    });
    
    return user || null;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: any) {
    
    // Admin yetkisi verilmek isteniyorsa şifre kontrolü yap
    if (updateUserDto.role) {
      // DİKKAT: Burayı Postman'deki şifreyle (123456) aynı yaptık!
      if (updateUserDto.adminSecret === '123456') { 
        // Şifre doğruysa role dokunma, admin olarak kalsın.
      } else {
        // Şifre yanlışsa role'ü sil (admin olamazsın)
        delete updateUserDto.role;
      }
    }

    // EN KRİTİK YER: Veritabanına "adminSecret" diye bir şey kaydetmeye çalışma!
    // Bu satır olmazsa 500 hatası alırsın.
    if (updateUserDto.adminSecret) {
      delete updateUserDto.adminSecret;
    }

    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}