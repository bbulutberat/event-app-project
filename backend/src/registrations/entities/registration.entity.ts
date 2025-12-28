import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  registrationDate: Date; // Kayıt olduğu tarih

  // Hangi kullanıcı?
  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  user: User;

  // Hangi etkinlik?
  @ManyToOne(() => Event, (event) => event.registrations, { onDelete: 'CASCADE' })
  event: Event;
}