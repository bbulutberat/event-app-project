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
    
    if (updateUserDto.role) {
      
      if (updateUserDto.adminSecret === '197453') {
        
        delete updateUserDto.adminSecret;
        
      } else {
        delete updateUserDto.role;
      }
    }

    if (updateUserDto.adminSecret) {
      delete updateUserDto.adminSecret;
    }

    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}