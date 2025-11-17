import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User, UserRole } from '../modules/auth/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@dentalclinic.com' }
  });

  if (!existingAdmin) {
    const adminUser = userRepository.create({
      email: 'admin@dentalclinic.com',
      password: 'Admin123!',
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
    });

    await adminUser.hashPassword();
    await userRepository.save(adminUser);
    console.log('Default admin user created: admin@dentalclinic.com / Admin123!');
  } else {
    console.log('Admin user already exists');
  }

  // Create demo dentist user
  const existingDentist = await userRepository.findOne({
    where: { email: 'dentist@dentalclinic.com' }
  });

  if (!existingDentist) {
    const dentistUser = userRepository.create({
      email: 'dentist@dentalclinic.com',
      password: 'Dentist123!',
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: UserRole.DENTIST,
    });

    await dentistUser.hashPassword();
    await userRepository.save(dentistUser);
    console.log('Demo dentist user created: dentist@dentalclinic.com / Dentist123!');
  }

  // Create demo staff user
  const existingStaff = await userRepository.findOne({
    where: { email: 'staff@dentalclinic.com' }
  });

  if (!existingStaff) {
    const staffUser = userRepository.create({
      email: 'staff@dentalclinic.com',
      password: 'Staff123!',
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.STAFF,
    });

    await staffUser.hashPassword();
    await userRepository.save(staffUser);
    console.log('Demo staff user created: staff@dentalclinic.com / Staff123!');
  }

  await app.close();
  console.log('Seeding completed!');
}

seed().catch(console.error);