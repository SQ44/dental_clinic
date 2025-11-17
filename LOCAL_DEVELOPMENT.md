# Dental Clinic Management System - Local Development Setup

This guide will help you set up the Dental Clinic Management System for local development and testing.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental_clinic
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   The `.env` file contains demo credentials that are ready to use.

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Run database migrations and seed demo data**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run start:dev
   ```

7. **Install frontend dependencies (in a new terminal)**
   ```bash
   cd ../frontend
   npm install
   ```

8. **Start the frontend server**
   ```bash
   npm run dev
   ```

9. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432 (accessible via any PostgreSQL client)

## Demo Credentials

After running the seeder, you can log in with these demo accounts:

### Admin User
- **Email:** admin@dentalclinic.com
- **Password:** Admin123!
- **Role:** Administrator (full access to all features)

### Demo Dentist
- **Email:** dentist@dentalclinic.com
- **Password:** Dentist123!
- **Role:** Dentist (can manage appointments and patients)

### Demo Staff
- **Email:** staff@dentalclinic.com
- **Password:** Staff123!
- **Role:** Staff (limited access for administrative tasks)

## Detailed Setup Steps

### 1. Database Setup

The application uses PostgreSQL. Docker Compose will automatically start a PostgreSQL container with the demo database.

**Database Configuration (from .env):**
- Database: `dental_clinic_demo`
- Username: `demo_user`
- Password: `demo_password_123`
- Host: `localhost`
- Port: `5432`

### 2. Backend Setup

The backend is built with NestJS and TypeORM.

**Key Dependencies:**
- NestJS (framework)
- TypeORM (database ORM)
- PostgreSQL (database)
- JWT (authentication)
- Stripe (payments)

**Available Scripts:**
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run seed` - Run database seeder
- `npm run test` - Run unit tests

### 3. Frontend Setup

The frontend is built with Next.js and TypeScript.

**Key Dependencies:**
- Next.js (React framework)
- TypeScript
- Tailwind CSS (styling)
- React Hook Form (forms)

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### 4. Docker Services

The `docker-compose.yml` includes:
- **PostgreSQL Database:** Persistent data storage
- **pgAdmin:** Web-based database administration (http://localhost:5050)
  - Email: admin@dentalclinic.com
  - Password: admin123

## Development Workflow

1. **Make changes** to the code
2. **Backend changes** will auto-reload with `npm run start:dev`
3. **Frontend changes** will auto-reload with `npm run dev`
4. **Database changes** require restarting the backend or running migrations

## Testing

- **Backend tests:** `cd backend && npm run test`
- **Frontend tests:** `cd frontend && npm run test` (if configured)
- **End-to-end tests:** `cd backend && npm run test:e2e`

## Troubleshooting

### Common Issues

1. **Port conflicts:** Ensure ports 3000, 3001, 5432, and 5050 are available
2. **Database connection:** Check that Docker containers are running with `docker ps`
3. **Dependencies:** Run `npm install` in both backend and frontend directories
4. **Environment variables:** Ensure `.env` file exists and is properly configured

### Reset Database

To reset the database and re-seed:
```bash
docker-compose down -v  # Remove containers and volumes
docker-compose up -d    # Restart services
cd backend
npm run seed           # Re-seed data
```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:3001/api/docs

## Next Steps

- Review the [architecture documentation](./architecture.md)
- Check the [deployment guide](./UBUNTU_DEPLOYMENT.md) for production setup
- Explore the codebase and understand the module structure