import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User, UserRole } from '../modules/auth/user.entity';
import { DataSource } from 'typeorm';
import { Patient } from '../modules/patients/patient.entity';
import { Dentist } from '../modules/appointments/dentist.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../modules/appointments/appointment.entity';
import { Invoice, InvoiceStatus } from '../modules/billing/invoice.entity';
import {
  BillingItem,
  BillingItemType,
} from '../modules/billing/billing-item.entity';
import { Payment, PaymentStatus } from '../modules/payments/payment.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@dentalclinic.com' },
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
    console.log(
      'Default admin user created: admin@dentalclinic.com / Admin123!',
    );
  } else {
    console.log('Admin user already exists');
  }

  // Create demo dentist user
  const existingDentist = await userRepository.findOne({
    where: { email: 'dentist@dentalclinic.com' },
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
    console.log(
      'Demo dentist user created: dentist@dentalclinic.com / Dentist123!',
    );
  }

  // Create demo staff user
  const existingStaff = await userRepository.findOne({
    where: { email: 'staff@dentalclinic.com' },
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

  // Seed dummy patients
  const patientRepository = dataSource.getRepository(Patient);
  const existingPatients = await patientRepository.count();

  if (existingPatients === 0) {
    const dummyPatients = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        dateOfBirth: '1985-03-15',
        address: '123 Main St, Anytown, USA',
        medicalHistory: 'No known allergies. Regular checkups.',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0102',
        dateOfBirth: '1990-07-22',
        address: '456 Oak Ave, Somewhere, USA',
        medicalHistory: 'Allergic to penicillin. Needs regular cleanings.',
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'm.brown@email.com',
        phone: '+1-555-0103',
        dateOfBirth: '1978-11-08',
        address: '789 Pine Rd, Elsewhere, USA',
        medicalHistory: 'Hypertension. Requires special care for gum disease.',
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0104',
        dateOfBirth: '1995-01-30',
        address: '321 Elm St, Nowhere, USA',
        medicalHistory: 'Braces completed 2 years ago. Excellent oral hygiene.',
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'd.wilson@email.com',
        phone: '+1-555-0105',
        dateOfBirth: '1982-09-12',
        address: '654 Maple Dr, Anywhere, USA',
        medicalHistory: 'Wisdom teeth extracted. Regular maintenance patient.',
      },
      {
        firstName: 'Lisa',
        lastName: 'Garcia',
        email: 'lisa.g@email.com',
        phone: '+1-555-0106',
        dateOfBirth: '1988-05-18',
        address: '987 Cedar Ln, Everywhere, USA',
        medicalHistory: 'Pregnant - needs special care. No known allergies.',
      },
      {
        firstName: 'Robert',
        lastName: 'Martinez',
        email: 'r.martinez@email.com',
        phone: '+1-555-0107',
        dateOfBirth: '1975-12-03',
        address: '147 Birch Ave, Someplace, USA',
        medicalHistory: 'Diabetic. Requires careful monitoring of oral health.',
      },
      {
        firstName: 'Jennifer',
        lastName: 'Anderson',
        email: 'j.anderson@email.com',
        phone: '+1-555-0108',
        dateOfBirth: '1992-08-25',
        address: '258 Spruce St, Othertown, USA',
        medicalHistory: 'TMJ disorder. Needs specialized treatment.',
      },
    ];

    for (const patientData of dummyPatients) {
      await patientRepository.save(patientData);
    }

    console.log('Dummy patients created successfully!');
  }

  // Seed dentists
  const dentistRepository = dataSource.getRepository(Dentist);
  const existingDentists = await dentistRepository.count();

  if (existingDentists === 0) {
    const dummyDentists = [
      {
        firstName: 'Olivia',
        lastName: 'Hart',
        email: 'olivia.hart@dentalclinic.com',
        specialty: 'Orthodontics',
        licenseNumber: 'DNT-1001',
      },
      {
        firstName: 'Marcus',
        lastName: 'Lee',
        email: 'marcus.lee@dentalclinic.com',
        specialty: 'Endodontics',
        licenseNumber: 'DNT-1002',
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@dentalclinic.com',
        specialty: 'Pediatric Dentistry',
        licenseNumber: 'DNT-1003',
      },
    ];

    for (const dentistData of dummyDentists) {
      await dentistRepository.save(dentistData);
    }

    console.log('Dummy dentists created successfully!');
  }

  // Seed appointments
  const appointmentRepository = dataSource.getRepository(Appointment);
  const appointmentCount = await appointmentRepository.count();

  if (appointmentCount === 0) {
    const patients = await patientRepository.find();
    const dentists = await dentistRepository.find();

    if (patients.length && dentists.length) {
      const appointmentTemplates = [
        {
          patient: patients[0],
          dentist: dentists[0],
          daysFromNow: 1,
          hour: 9,
          durationMinutes: 60,
          status: AppointmentStatus.SCHEDULED,
          notes: 'Routine cleaning and check-up',
        },
        {
          patient: patients[1],
          dentist: dentists[1],
          daysFromNow: -2,
          hour: 11,
          durationMinutes: 45,
          status: AppointmentStatus.COMPLETED,
          notes: 'Root canal follow-up',
        },
        {
          patient: patients[2],
          dentist: dentists[2],
          daysFromNow: 5,
          hour: 10,
          durationMinutes: 30,
          status: AppointmentStatus.SCHEDULED,
          notes: 'Consultation for braces',
        },
        {
          patient: patients[3],
          dentist: dentists[0],
          daysFromNow: 0,
          hour: 14,
          durationMinutes: 50,
          status: AppointmentStatus.CANCELLED,
          notes: 'Patient rescheduled due to illness',
        },
        {
          patient: patients[4],
          dentist: dentists[1],
          daysFromNow: -7,
          hour: 16,
          durationMinutes: 60,
          status: AppointmentStatus.COMPLETED,
          notes: 'Crown placement',
        },
      ];

      const baseDate = new Date();
      const savedAppointments: Appointment[] = [];

      for (const template of appointmentTemplates) {
        const appointmentDate = new Date(baseDate);
        appointmentDate.setDate(baseDate.getDate() + template.daysFromNow);
        appointmentDate.setHours(template.hour, 0, 0, 0);

        const appointment = appointmentRepository.create({
          patient: template.patient,
          patientId: template.patient.id,
          dentist: template.dentist,
          dentistId: template.dentist.id,
          appointmentDate,
          durationMinutes: template.durationMinutes,
          status: template.status,
          notes: template.notes,
        });

        const savedAppointment = await appointmentRepository.save(appointment);
        savedAppointment.patient = template.patient;
        savedAppointment.dentist = template.dentist;
        savedAppointments.push(savedAppointment);
      }

      console.log('Dummy appointments created successfully!');

      // Seed invoices, billing items, and payments
      const invoiceRepository = dataSource.getRepository(Invoice);
      const billingItemRepository = dataSource.getRepository(BillingItem);
      const paymentRepository = dataSource.getRepository(Payment);

      const invoicesExist = await invoiceRepository.count();

      if (invoicesExist === 0) {
        const invoiceConfigs = [
          {
            appointment: savedAppointments[0],
            status: InvoiceStatus.PENDING,
            dueInDays: 14,
            items: [
              {
                description: 'Comprehensive oral exam',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 120,
              },
              {
                description: 'Adult prophylaxis cleaning',
                type: BillingItemType.TREATMENT,
                quantity: 1,
                unitPrice: 95,
              },
            ],
            payment: {
              status: PaymentStatus.SUCCEEDED,
            },
          },
          {
            appointment: savedAppointments[1],
            status: InvoiceStatus.PAID,
            dueInDays: 0,
            items: [
              {
                description: 'Root canal therapy',
                type: BillingItemType.TREATMENT,
                quantity: 1,
                unitPrice: 850,
              },
              {
                description: 'Post-operative medication',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 45,
              },
            ],
            payment: {
              status: PaymentStatus.SUCCEEDED,
            },
          },
          {
            appointment: savedAppointments[2],
            status: InvoiceStatus.PENDING,
            dueInDays: 21,
            items: [
              {
                description: 'Orthodontic consultation',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 150,
              },
              {
                description: '3D imaging',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 200,
              },
            ],
            payment: {
              status: PaymentStatus.PENDING,
            },
          },
          {
            appointment: savedAppointments[3],
            status: InvoiceStatus.OVERDUE,
            dueInDays: -5,
            items: [
              {
                description: 'Emergency evaluation',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 160,
              },
            ],
            payment: {
              status: PaymentStatus.FAILED,
            },
          },
          {
            appointment: savedAppointments[4],
            status: InvoiceStatus.PAID,
            dueInDays: 3,
            items: [
              {
                description: 'Crown placement',
                type: BillingItemType.PROCEDURE,
                quantity: 1,
                unitPrice: 1100,
              },
              {
                description: 'Temporary crown fabrication',
                type: BillingItemType.TREATMENT,
                quantity: 1,
                unitPrice: 180,
              },
            ],
            payment: {
              status: PaymentStatus.SUCCEEDED,
            },
          },
        ];

        let paymentCounter = 1;

        for (const config of invoiceConfigs) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + config.dueInDays);

          const invoice = await invoiceRepository.save(
            invoiceRepository.create({
              patient: config.appointment.patient,
              patientId: config.appointment.patient.id,
              appointment: config.appointment,
              appointmentId: config.appointment.id,
              totalAmount: 0,
              status: config.status,
              dueDate,
            }),
          );

          let invoiceTotal = 0;

          for (const item of config.items) {
            const total = item.quantity * item.unitPrice;
            invoiceTotal += total;

            await billingItemRepository.save(
              billingItemRepository.create({
                invoice,
                invoiceId: invoice.id,
                description: item.description,
                type: item.type,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total,
              }),
            );
          }

          invoice.totalAmount = invoiceTotal;
          await invoiceRepository.save(invoice);

          await paymentRepository.save(
            paymentRepository.create({
              invoice,
              invoiceId: invoice.id,
              amount: invoiceTotal,
              status: config.payment.status,
              currency: 'usd',
              stripePaymentIntentId: `pi_demo_${paymentCounter.toString().padStart(3, '0')}`,
              stripeClientSecret: `pi_demo_${paymentCounter.toString().padStart(3, '0')}_secret`,
            }),
          );

          paymentCounter += 1;
        }

        console.log(
          'Invoices, billing items, and payments created successfully!',
        );
      }
    } else {
      console.warn(
        'Unable to seed appointments due to missing patients or dentists.',
      );
    }
  }

  await app.close();
  console.log('Seeding completed!');
}

seed().catch(console.error);
