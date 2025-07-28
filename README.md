# NestJS JWT Login Dashboard Project

## Setup

1. Navigate to the project directory:
```bash
cd nestjs-jwt-login-dashboard
```

2. Install dependencies:
```bash
npm install
npm install mssql
```

## Running the Project

```bash
npm run start:dev
```

The backend server will start on http://localhost:3000

## Features

- JWT authentication with login endpoint at `/auth/login`
- Protected GET endpoint `/vappusuarios` fetching data from SQL Server database view `[dbo].[vappusuarios]`
- Simple frontend login screen and dashboard served at `/frontend/index.html`

## Database Connection

- Server: 10.8.2.226,1433
- User: sa
- Password: $ignos1234
- Database: DbSolicitudEfectivo
- Encrypt: true
- Trust Server Certificate: true

Make sure the database is accessible from your environment.

## Notes

- The frontend is a simple static HTML page served by NestJS.
- JWT secret key is hardcoded as 'your_jwt_secret_key' in the auth module; change it for production use.
