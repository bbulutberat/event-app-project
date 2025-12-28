import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registration } from '../../registrations/entities/registration.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string; // İsim

  @Column()
  lastName: string;  // Soyisim

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string; // Telefon (Sıfırsız)

  @Column()
  password: string;

  @Column({ default: 'user' }) 
  role: string;

  @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];
}