import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('dentists')
export class Dentist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  specialty: string;

  @Column({ name: 'license_number', length: 50, unique: true, nullable: true })
  licenseNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}