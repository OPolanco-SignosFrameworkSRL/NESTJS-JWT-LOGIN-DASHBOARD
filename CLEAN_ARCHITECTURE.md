# 🏗️ Clean Architecture - NestJS JWT Login Dashboard

## 📁 Estructura del Proyecto

```
src/
├── core/                          # 🎯 Capa de Dominio (Core Business Logic)
│   ├── domain/                    # Entidades y Reglas de Negocio
│   │   ├── entities/              # Entidades del dominio
│   │   │   ├── user.entity.ts
│   │   │   └── user-write.entity.ts
│   │   ├── repositories/          # Interfaces de repositorios
│   │   │   └── user.repository.interface.ts
│   │   ├── services/              # Servicios del dominio
│   │   │   ├── auth.service.ts
│   │   │   └── users.service.ts
│   │   ├── user.interface.ts      # Interfaces del dominio
│   │   ├── user.service.interface.ts
│   │   ├── auth.service.interface.ts
│   │   └── crypto.service.interface.ts
│   └── application/               # Casos de Uso
│       ├── use-cases/             # Casos de uso específicos
│       └── dto/                   # Data Transfer Objects
│           ├── login.dto.ts
│           ├── register.dto.ts
│           ├── update-user.dto.ts
│           ├── user-filters.dto.ts
│           ├── update-phone.dto.ts
│           └── delete-user.dto.ts
├── infrastructure/                # 🔧 Capa de Infraestructura
│   ├── database/                  # Configuración de base de datos
│   │   └── entities/              # Entidades de TypeORM
│   │       ├── user.entity.ts
│   │       └── user-write.entity.ts
│   ├── repositories/              # Implementaciones de repositorios
│   │   └── user.repository.ts
│   └── services/                  # Servicios externos
│       └── crypto.service.ts
├── presentation/                  # 🎨 Capa de Presentación
│   ├── controllers/               # Controladores REST
│   │   ├── auth.controller.ts
│   │   └── users.controller.ts
│   ├── modules/                   # Módulos de NestJS
│   │   ├── auth.module.ts
│   │   └── users.module.ts
│   ├── guards/                    # Guards de autenticación
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/                # Decoradores personalizados
│   │   └── roles.decorator.ts
│   ├── strategies/                # Estrategias de Passport
│   │   └── jwt.strategy.ts
│   ├── interceptors/              # Interceptores
│   ├── filters/                   # Filtros de excepción
│   └── pipes/                     # Pipes de validación
├── config/                        # ⚙️ Configuración
│   ├── app.config.ts
│   ├── database.config.ts
│   └── jwt.config.ts
├── app.controller.ts              # Controlador principal
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada
```

## 🎯 Principios de Clean Architecture

### 1. **Independencia de Frameworks**
- El dominio no depende de NestJS, TypeORM, o cualquier framework externo
- Las entidades del dominio son clases puras de TypeScript

### 2. **Testabilidad**
- Cada capa puede ser testeada independientemente
- Las dependencias están invertidas (Dependency Inversion Principle)

### 3. **Independencia de UI**
- La lógica de negocio no depende de la interfaz de usuario
- Los controladores solo manejan HTTP, no lógica de negocio

### 4. **Independencia de Base de Datos**
- El dominio no conoce detalles de la base de datos
- Los repositorios son interfaces en el dominio, implementaciones en infraestructura

### 5. **Independencia de Agentes Externos**
- El dominio no depende de servicios externos
- Los servicios externos se implementan en la capa de infraestructura

## 🔄 Flujo de Dependencias

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑           ↑
  Controllers   Use Cases   Entities   Repositories
     ↓              ↓           ↑           ↑
  HTTP/API      DTOs       Business    Database
```

## 📋 Responsabilidades por Capa

### 🎯 **Core Domain**
- **Entidades**: Objetos de negocio puros
- **Servicios**: Lógica de negocio compleja
- **Interfaces**: Contratos para repositorios y servicios
- **DTOs**: Estructuras de datos para transferencia

### 🔧 **Infrastructure**
- **Repositorios**: Implementación de acceso a datos
- **Servicios**: Integración con servicios externos
- **Entidades DB**: Mapeo de TypeORM

### 🎨 **Presentation**
- **Controladores**: Manejo de HTTP y validación
- **Guards**: Autenticación y autorización
- **Módulos**: Configuración de NestJS

## 🚀 Beneficios de esta Arquitectura

1. **Mantenibilidad**: Código organizado y fácil de entender
2. **Escalabilidad**: Fácil agregar nuevas funcionalidades
3. **Testabilidad**: Cada capa puede ser testeada independientemente
4. **Flexibilidad**: Fácil cambiar tecnologías sin afectar el dominio
5. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica

## 🔧 Configuración

### Variables de Entorno
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
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
```

### Scripts Disponibles
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
```

## 📚 Documentación API

La documentación de la API está disponible en:
- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

## 🎨 Características Implementadas

### ✅ Autenticación JWT
- Login con cédula y contraseña
- Registro de usuarios
- Verificación de tokens
- Roles y permisos

### ✅ Gestión de Usuarios
- CRUD completo de usuarios
- Soft delete con restauración
- Búsqueda y filtros
- Estadísticas de usuarios

### ✅ Seguridad
- Hashing SHA256 de contraseñas
- Validación de roles
- Guards de autenticación
- Validación de datos con DTOs

### ✅ Base de Datos
- SQL Server con TypeORM
- Entidades separadas para lectura y escritura
- Migraciones automáticas
- Soft delete implementado

## 🔮 Próximas Mejoras

1. **Logging**: Implementar sistema de logs estructurado
2. **Caching**: Agregar Redis para caché
3. **Rate Limiting**: Protección contra ataques de fuerza bruta
4. **Auditoría**: Log de cambios en usuarios
5. **Notificaciones**: Sistema de emails/SMS
6. **Tests**: Cobertura completa de tests unitarios e integración 