import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    // Kategori ID'si ile ilişki kurarak kaydeder
    return this.eventRepository.save(createEventDto);
  }

  findAll() {
    // relations: ['category'] sayesinde etkinliğin kategorisini de getirir
    return this.eventRepository.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.eventRepository.findOne({ 
      where: { id },
      relations: ['category'] 
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}