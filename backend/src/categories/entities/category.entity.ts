import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Kategori adı (Örn: Konser, Tiyatro)

  @Column({ nullable: true })
  description: string; // Açıklama

  // Bir kategorinin birden çok etkinliği olabilir (Bire-Çok İlişki)
  @OneToMany(() => Event, (event) => event.category)
  events: Event[];
}