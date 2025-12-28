import { Injectable, ConflictException } from '@nestjs/common'; // ConflictException eklendi
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  // GÜNCELLENEN KISIM: KONTROLLÜ KAYIT
  async create(createRegistrationDto: any) {
    // 1. Önce veritabanına sor: Bu kullanıcı (user.id) bu etkinliğe (event.id) kayıtlı mı?
    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        user: { id: createRegistrationDto.user.id },
        event: { id: createRegistrationDto.event.id },
      },
    });

    // 2. Eğer zaten kayıt varsa HATA FIRLAT ve dur.
    if (existingRegistration) {
      throw new ConflictException('Bu kullanıcı zaten bu etkinliğe kayıtlı!');
    }

    // 3. Kayıt yoksa işlemi yap.
    return this.registrationRepository.save(createRegistrationDto);
  }

  findAll() {
    return this.registrationRepository.find({ relations: ['user', 'event'] });
  }

  findByEvent(eventId: number) {
    return this.registrationRepository.find({
      where: { event: { id: eventId } },
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.registrationRepository.findOne({ 
      where: { id },
      relations: ['user', 'event'] 
    });
  }

  update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    return this.registrationRepository.update(id, updateRegistrationDto);
  }

  remove(id: number) {
    return this.registrationRepository.delete(id);
  }
}