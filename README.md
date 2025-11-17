# Dental Clinic Management System

A comprehensive full-stack application for managing dental clinic operations, built with modern web technologies.

## Features

- **Patient Management**: Complete patient records and history
- **Appointment Scheduling**: Calendar-based appointment management
- **Billing & Payments**: Invoice generation and Stripe payment integration
- **User Roles**: Admin, Dentist, Staff, and Patient access levels
- **Responsive UI**: Modern Next.js frontend with Tailwind CSS
- **RESTful API**: NestJS backend with TypeORM and PostgreSQL

## Quick Start

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd dental_clinic
   cp .env.example .env
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Setup backend**
   ```bash
   cd backend
   npm install
   npm run seed
   npm run start:dev
   ```

4. **Setup frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Demo Credentials

- **Admin**: admin@dentalclinic.com / Admin123!
- **Dentist**: dentist@dentalclinic.com / Dentist123!
- **Staff**: staff@dentalclinic.com / Staff123!

## Production Deployment

For Ubuntu server deployment, see [deploy/README.md](deploy/README.md)

## Architecture

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Database**: PostgreSQL with TypeORM migrations
- **Authentication**: JWT with role-based access control
- **Payments**: Stripe integration
- **Deployment**: Docker Compose for containerization

## Project Structure

```
dental_clinic/
├── backend/                 # NestJS API server
├── frontend/               # Next.js web application
├── deploy/                 # Deployment scripts and docs
├── nginx/                  # Reverse proxy configuration
├── docker-compose.yml      # Local development orchestration
├── .env.example           # Environment template
├── LOCAL_DEVELOPMENT.md   # Local setup guide
└── architecture.md        # System architecture docs
```

## Documentation

- [Local Development Setup](LOCAL_DEVELOPMENT.md)
- [Ubuntu Server Deployment](deploy/README.md)
- [System Architecture](architecture.md)

## Technologies Used

### Backend
- NestJS (Node.js framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Stripe (Payments)
- Docker (Containerization)

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS (Styling)
- React Hook Form (Forms)

### DevOps
- Docker & Docker Compose
- Nginx (Reverse proxy)
- Let's Encrypt (SSL certificates)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.