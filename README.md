# 🚀 NestJS JWT Login Dashboard

> **Sistema de autenticación y gestión de usuarios con Clean Architecture**

[![NestJS](https://img.shields.io/badge/NestJS-8.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.0-blue.svg)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.0-green.svg)](https://typeorm.io/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-orange.svg)](https://www.microsoft.com/en-us/sql-server/)
[![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-✅-brightgreen.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [📚 API Documentation](#-api-documentation)
- [🔧 Uso](#-uso)
- [🧪 Testing](#-testing)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🎯 Características

### ✅ **Autenticación JWT**
- 🔐 Login seguro con cédula y contraseña
- 🎫 Tokens JWT con expiración configurable
- 🔒 Hashing SHA256 de contraseñas
- 👥 Sistema de roles y permisos

### ✅ **Gestión de Usuarios**
- 👤 CRUD completo de usuarios
- 🗑️ Soft delete con restauración
- 🔍 Búsqueda y filtros avanzados
- 📊 Estadísticas de usuarios
- 📱 Actualización de teléfonos

### ✅ **Seguridad**
- 🛡️ Validación de roles con Guards
- 🔐 Decoradores de autorización
- ✅ Validación de datos con DTOs
- 🚫 Protección contra auto-eliminación
- 👑 Protección del último administrador

### ✅ **Base de Datos**
- 🗄️ SQL Server con TypeORM
- 📖 Entidades separadas para lectura/escritura
- 🔄 Migraciones automáticas
- 🗑️ Soft delete implementado

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** siguiendo los principios de Uncle Bob:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Controllers │ │   Guards    │ │ Decorators  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Use Cases  │ │    DTOs     │ │ Validators  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Entities   │ │  Services   │ │Interfaces   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │Repositories │ │   Services  │ │   Database  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 **Principios Aplicados**

- **Independencia de Frameworks**: El dominio no depende de NestJS
- **Testabilidad**: Cada capa puede ser testeada independientemente
- **Independencia de UI**: La lógica de negocio no depende de la interfaz
- **Independencia de Base de Datos**: El dominio no conoce detalles de la DB
- **Independencia de Agentes Externos**: El dominio no depende de servicios externos

## 🚀 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (opcional, para SQL Server)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/) (2019 o superior)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd nestjs-jwt-login-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:

```env
# App
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=appusuarios

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=24h
```

### 4. Configurar base de datos

#### Opción A: Docker (Recomendado)

```bash
docker-compose up -d
```

#### Opción B: SQL Server local

1. Instalar SQL Server
2. Crear base de datos `appusuarios`
3. Ejecutar la migración de soft delete (si es necesario):

```bash
# Ver el script de migración
cat database-migrations/soft-delete-migration.sql
```

**Nota:** El script de migración solo es necesario si tu base de datos no tiene los campos `deleted_at` y `deleted_by` en la tabla `appusuarios`.

### 5. Ejecutar migraciones

```bash
npm run migration:run
```

### 6. Migración de Soft Delete (Opcional)

Si tu base de datos no tiene los campos necesarios para soft delete, ejecuta:

```sql
-- En SQL Server Management Studio
-- Usar el script: database-migrations/soft-delete-migration.sql
-- Reemplazar 'TU_BASE_DE_DATOS' con el nombre real de tu BD
```

**Campos que se agregan:**
- `deleted_at` (DATETIME NULL) - Fecha de eliminación
- `deleted_by` (INT NULL) - ID del usuario que eliminó
- Índice para mejorar performance

### 7. Migración de Solicitudes de Efectivo (Opcional)

Para crear la tabla de solicitudes de efectivo, ejecuta:

```sql
-- En SQL Server Management Studio
-- Usar el script: database-migrations/create-cash-requests-table.sql
-- Reemplazar 'TU_BASE_DE_DATOS' con el nombre real de tu BD
```

**Tabla que se crea:**
- `cash_requests` - Tabla principal para solicitudes de efectivo
- Índices para mejorar performance
- Foreign keys con la tabla de usuarios

### 8. Iniciar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `1433` |
| `DB_USERNAME` | Usuario de la base de datos | `sa` |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `DB_DATABASE` | Nombre de la base de datos | `appusuarios` |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |

### Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor de desarrollo con hot reload
npm run start:debug        # Servidor con debugging

# Producción
npm run build              # Compilar el proyecto
npm run start:prod         # Servidor de producción

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Tests con cobertura

# Utilidades
npm run clean              # Limpiar archivos generados
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir última migración
```

## 📚 API Documentation

### Swagger UI
La documentación interactiva está disponible en:
```
http://localhost:3000/api
```

### Endpoints Principales

#### 🔐 Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/verify-token` - Verificar token
- `POST /auth/update-phone` - Actualizar teléfono

#### 👥 Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario (soft delete)
- `PATCH /users/:id/restore` - Restaurar usuario

#### 💰 Solicitudes de Efectivo
- `GET /cash-requests` - Listar solicitudes
- `GET /cash-requests/my-requests` - Mis solicitudes
- `GET /cash-requests/:id` - Obtener solicitud por ID
- `POST /cash-requests` - Crear solicitud
- `PATCH /cash-requests/:id` - Actualizar solicitud
- `PATCH /cash-requests/:id/approve` - Aprobar solicitud (admin)
- `PATCH /cash-requests/:id/reject` - Rechazar solicitud (admin)
- `DELETE /cash-requests/:id` - Eliminar solicitud (soft delete)
- `PATCH /cash-requests/:id/restore` - Restaurar solicitud (admin)
- `GET /cash-requests/filters` - Filtrar solicitudes
- `GET /cash-requests/stats` - Estadísticas (admin)
- `GET /users/deleted/list` - Listar usuarios eliminados
- `GET /users/stats` - Estadísticas de usuarios

### Ejemplo de Uso

#### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "40245980129",
    "password": "password123"
  }'
```

#### 2. Crear Usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cedula": "40245980130",
    "nombre": "Juan",
    "apellido": "Pérez",
    "password": "password123",
    "clave": "MiClaveSecreta",
    "role": "Usuario",
    "user_email": "juan.perez@email.com"
  }'
```

## 🔧 Uso

### Roles Disponibles

- **Admin**: Acceso completo al sistema
- **Supervisor**: Gestión de usuarios y estadísticas
- **Manager**: Gestión limitada de usuarios
- **Usuario**: Acceso básico al sistema

### Funcionalidades por Rol

| Funcionalidad | Admin | Supervisor | Manager | Usuario |
|---------------|-------|------------|---------|---------|
|Ver usuarios   |  ✅  |     ✅     |   ✅   |    ❌   |
|Crear usuarios |  ✅  |     ✅     |   ❌   |    ❌   |
|Editar usuarios|  ✅  |     ✅     |   ✅   |    ❌   |
|Eliminar usuarios| ✅ |     ❌     |   ❌   |    ❌   |
|Ver estadísticas | ✅ |     ✅     |   ❌   |    ❌   |
|Restaurar usuarios| ✅|     ❌     |   ❌   |    ❌   |

### Soft Delete

El sistema implementa **soft delete** para mayor seguridad:

- Los usuarios no se eliminan físicamente
- Se marcan como `valido = '0'`
- Se registra `deleted_at` y `deleted_by`
- Se pueden restaurar con el endpoint `/users/:id/restore`

Para eliminación física permanente:
```json
{
  "confirmPermanentDelete": true,
  "confirmText": "SI, ELIMINAR PERMANENTEMENTE",
  "reason": "Motivo de la eliminación"
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests end-to-end
npm run test:e2e

# Tests con cobertura
npm run test:cov
```

### Estructura de Tests

```
test/
├── unit/                    # Tests unitarios
│   ├── auth.service.spec.ts
│   └── users.service.spec.ts
├── e2e/                     # Tests end-to-end
│   ├── auth.e2e-spec.ts
│   └── users.e2e-spec.ts
└── jest-e2e.json           # Configuración Jest E2E
```

## 📁 Estructura del Proyecto

```
src/
├── core/                          # 🎯 Capa de Dominio
│   ├── domain/                    # Entidades y Reglas de Negocio
│   │   ├── entities/              # Entidades del dominio
│   │   ├── repositories/          # Interfaces de repositorios
│   │   ├── services/              # Servicios del dominio
│   │   └── *.interface.ts         # Interfaces del dominio
│   └── application/               # Casos de Uso
│       ├── use-cases/             # Casos de uso específicos
│       └── dto/                   # Data Transfer Objects
├── infrastructure/                # 🔧 Capa de Infraestructura
│   ├── database/                  # Configuración de base de datos
│   ├── repositories/              # Implementaciones de repositorios
│   └── services/                  # Servicios externos
├── presentation/                  # 🎨 Capa de Presentación
│   ├── controllers/               # Controladores REST
│   ├── modules/                   # Módulos de NestJS
│   ├── guards/                    # Guards de autenticación
│   ├── decorators/                # Decoradores personalizados
│   └── strategies/                # Estrategias de Passport
├── config/                        # ⚙️ Configuración
├── app.controller.ts              # Controlador principal
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada
```

## 🤝 Contribución

### 1. Fork el proyecto

### 2. Crear una rama para tu feature
```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit tus cambios
```bash
git commit -m 'Add some AmazingFeature'
```

### 4. Push a la rama
```bash
git push origin feature/AmazingFeature
```

### 5. Abrir un Pull Request

### Guías de Contribución

- Sigue los principios de Clean Architecture
- Escribe tests para nuevas funcionalidades
- Mantén la documentación actualizada
- Usa commits semánticos
- Sigue las convenciones de código

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [Passport](http://www.passportjs.org/) - Autenticación para Node.js
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Uncle Bob

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/nestjs-jwt-login-dashboard/issues)
- 📖 Documentación: [Wiki](https://github.com/tu-usuario/nestjs-jwt-login-dashboard/wiki)

---

<div align="center">

**¡Construido con ❤️ usando Clean Architecture!**

[![NestJS](https://nestjs.com/img/logo-small.svg)](https://nestjs.com/)
[![TypeScript](https://www.typescriptlang.org/images/branding/logo.svg)](https://www.typescriptlang.org/)

</div>
