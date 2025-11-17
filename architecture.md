# Dental Clinic Management System - Technical Specification

## Overview
This document outlines the system architecture for a Dental Clinic Management System, including backend for patient management, Next.js frontend, appointment and billing systems, secure online payments, and deployment on DigitalOcean droplet.

## Technology Stack
- **Backend Framework**: NestJS (Node.js) with TypeScript for structured, scalable API development
- **Frontend Framework**: Next.js (React) for server-side rendering and SEO optimization
- **Database**: PostgreSQL for relational data management
- **Payment Gateway**: Stripe for secure online payments
- **Authentication**: JWT (JSON Web Tokens) with role-based access control
- **Deployment**: DigitalOcean droplet with Docker containerization
- **Additional Tools**: Nginx for reverse proxy, Let's Encrypt for SSL, GitHub Actions for CI/CD

## High-Level Architecture

The system follows a client-server architecture with separation of concerns:

```
graph TD
    A[Client Browser] --> B[Next.js Frontend]
    B --> C[NestJS Backend API]
    C --> D[PostgreSQL Database]
    C --> E[Stripe Payment Gateway]
    F[DigitalOcean Droplet] --> G[Nginx Reverse Proxy]
    G --> B
    G --> C
    C --> H[Docker Container]
    D --> H
```

### Architecture Components
- **Frontend Layer**: Next.js application handling user interface and client-side logic
- **API Layer**: NestJS REST API providing business logic and data access
- **Data Layer**: PostgreSQL database storing all clinic data
- **Payment Layer**: Stripe integration for secure payment processing
- **Infrastructure Layer**: DigitalOcean droplet with Docker containers and Nginx

## API Endpoints Overview

### Patient Management
- `GET /api/patients` - Retrieve all patients (admin/dentist only)
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient information
- `DELETE /api/patients/:id` - Delete patient (admin only)

### Appointment Management
- `GET /api/appointments` - Get appointments (filtered by user role)
- `POST /api/appointments` - Schedule new appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Billing System
- `GET /api/billing/invoices` - Get invoices
- `POST /api/billing/invoices` - Create invoice
- `GET /api/billing/invoices/:id` - Get invoice details
- `PUT /api/billing/invoices/:id` - Update invoice status

### Payment System
- `POST /api/payments` - Process payment via Stripe
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments` - Get payment history

## Database Schema

### Core Tables

#### Patients
```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Dentists
```sql
CREATE TABLE dentists (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialty VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointments
```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    dentist_id INTEGER REFERENCES dentists(id),
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Invoices
```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- card, bank_transfer
    stripe_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed', -- completed, failed, refunded
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- Patients → Appointments (1:many)
- Dentists → Appointments (1:many)
- Appointments → Invoices (1:1)
- Invoices → Payments (1:many)

## Security Considerations

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Dentist, Patient)
- Password hashing with bcrypt
- Session management with secure cookies

### Data Protection
- HTTPS encryption for all data in transit
- Database encryption at rest
- Input validation and sanitization
- SQL injection prevention with parameterized queries

### Payment Security
- PCI DSS compliance through Stripe integration
- No storage of sensitive payment data
- Secure webhook handling for payment confirmations

### Additional Measures
- Rate limiting on API endpoints
- CORS configuration for frontend access
- Audit logging for sensitive operations
- Regular security updates and dependency scanning
- Environment variable management for secrets

## Deployment Strategy

### Infrastructure Setup
- DigitalOcean droplet (Ubuntu 22.04 LTS)
- Docker and Docker Compose for containerization
- PostgreSQL database container
- Nginx reverse proxy for load balancing and SSL termination

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- Docker image building and pushing to registry
- Automated deployment to staging and production environments

### Environment Configuration
- Separate environments for development, staging, and production
- Environment variables for database credentials, API keys, and secrets
- SSL certificates via Let's Encrypt

### Monitoring & Maintenance
- Application logging with Winston
- Health check endpoints for monitoring
- Automated backups of database
- Regular security patches and updates

This architecture provides a scalable, secure, and maintainable foundation for the Dental Clinic Management System.