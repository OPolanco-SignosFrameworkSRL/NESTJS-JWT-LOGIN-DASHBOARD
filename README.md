# 🔐 SolicitudEfectivo - Backend API

API REST desarrollada con **NestJS** y **TypeScript** para la gestión de solicitudes de efectivo.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run start:dev
```

## 📋 Requisitos

- Node.js >= 18
- SQL Server 2019+
- npm o pnpm

## ⚙️ Variables de Entorno

```env
DB_HOST=192.168.0.236
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=$ignos1234
DB_DATABASE=DbSolicitudEfectivo_v1
JWT_SECRET=your-secret-key
PORT=3000
```

## 🔌 Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Solicitudes de Efectivo
- `GET /cash-requests` - Listar solicitudes
- `POST /cash-requests` - Crear solicitud
- `GET /cash-requests/:id` - Obtener solicitud
- `PUT /cash-requests/:id` - Actualizar solicitud

### Usuarios
- `GET /users` - Listar usuarios
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Roles
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol
- `PUT /roles/:id` - Actualizar rol

## 📝 Scripts

```bash
npm run start:dev      # Desarrollo con watch
npm run build          # Construir para producción
npm run start          # Ejecutar producción
npm run test           # Tests
npm run lint           # Linting
npm run check-db       # Verificar DB
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 📚 Documentación API

Swagger UI disponible en: `http://localhost:3000/api/docs`

## 🏗 Arquitectura

- **Clean Architecture** con separación de capas
- **TypeORM** para base de datos
- **JWT** para autenticación
- **Swagger** para documentación
