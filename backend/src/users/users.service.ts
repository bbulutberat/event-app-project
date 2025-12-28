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

  async update(id: number, updateUserDto: any) {
    
    // YENİ YÖNTEM: Gelen veriyi olduğu gibi kullanmıyoruz.
    // Tertemiz, boş bir "güncelleme kutusu" oluşturuyoruz.
    const cleanData: any = {};

    // Sadece izin verdiğimiz bilgileri tek tek bu kutuya koyuyoruz.
    // (Böylece adminSecret istese de araya kaynayamaz)
    if (updateUserDto.firstName) cleanData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) cleanData.lastName = updateUserDto.lastName;
    if (updateUserDto.email) cleanData.email = updateUserDto.email;
    if (updateUserDto.phoneNumber) cleanData.phoneNumber = updateUserDto.phoneNumber;
    
    // ŞİFRE KONTROLÜ VE YETKİ
    if (updateUserDto.role === 'admin') {
      // Eğer postman'den gelen şifre doğruysa kutuya 'admin' yazıyoruz.
      if (updateUserDto.adminSecret === '123456') {
        cleanData.role = 'admin';
      }
      // Şifre yanlışsa hiçbir şey yapmıyoruz (role eklenmiyor).
    }

    // Artık elimizde içinde SADECE temiz verilerin olduğu "cleanData" var.
    return this.userRepository.update(id, cleanData);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}