import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Registration } from '../../registrations/entities/registration.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Etkinlik Başlığı

  @Column()
  description: string;

  @Column()
  date: string; // Etkinlik tarihi

  @Column()
  location: string;

  @Column()
  price: number;

  // Bir etkinlik sadece BİR kategoriye aittir (Çoktan-Bire)
  @ManyToOne(() => Category, (category) => category.events)
  category: Category;

  // Bir etkinliğin birden çok kaydı (katılımcısı) olabilir
  @OneToMany(() => Registration, (registration) => registration.event, { onDelete: 'CASCADE' })
  registrations: Registration[];
}