CREATE USER demo_user WITH PASSWORD 'demo_password_123';
CREATE DATABASE dental_clinic_demo OWNER demo_user;
GRANT ALL PRIVILEGES ON DATABASE dental_clinic_demo TO demo_user;

$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'postgres';
  END IF;
END
$$;