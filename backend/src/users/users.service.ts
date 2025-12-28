import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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

  async login(identifier: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier, password: pass },
        { phoneNumber: identifier, password: pass }
      ]
    });
    return user || null;
  }

  findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
      }
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // --- DEDEKTİF MODU AKTİF ---
  async update(id: number, updateUserDto: any) {
    console.log("DEDEKTIF: Guncelleme istegi geldi. ID:", id);
    console.log("DEDEKTIF: Gelen veri:", JSON.stringify(updateUserDto));

    const cleanData: any = {};

    // Sadece güvenli verileri alıyoruz
    if (updateUserDto.firstName) cleanData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) cleanData.lastName = updateUserDto.lastName;
    if (updateUserDto.email) cleanData.email = updateUserDto.email;
    if (updateUserDto.phoneNumber) cleanData.phoneNumber = updateUserDto.phoneNumber;
    
    // Şifre kontrolü
    if (updateUserDto.role === 'admin') {
      // Şifre 123456 ise admin yap, değilse yapma
      if (updateUserDto.adminSecret === '123456') {
        cleanData.role = 'admin';
        console.log("DEDEKTIF: Şifre doğru, admin yetkisi veriliyor.");
      } else {
        console.log("DEDEKTIF: Şifre YANLIŞ veya YOK.");
      }
    }

    console.log("DEDEKTIF: Veritabanına gönderilecek TEMIZ veri:", JSON.stringify(cleanData));

    try {
      // Güncellemeyi dene
      const result = await this.userRepository.update(id, cleanData);
      return result;

    } catch (error) {
      // HATA OLURSA BURAYA DÜŞECEK
      console.error("DEDEKTIF: Veritabanı hatası oluştu!", error);
      
      // Postman'e hatayı olduğu gibi gönderiyoruz
      throw new InternalServerErrorException({
        message: "Veritabanı güncelleme hatası",
        errorDetail: error.message, // Hatanın asıl sebebi burada yazacak
        sqlMessage: error.sqlMessage // SQL hatası varsa burada yazar
      });
    }
  }
  // ---------------------------

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}