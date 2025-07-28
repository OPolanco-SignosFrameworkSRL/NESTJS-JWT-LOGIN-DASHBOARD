# Sistema de Autenticación NestJS con JWT y bcrypt

Este proyecto implementa un sistema completo de autenticación usando NestJS, JWT, bcrypt y TypeORM.

## Características Implementadas

✅ **TypeORM** para manejo de base de datos  
✅ **bcrypt** para encriptación de contraseñas (10 salt rounds)  
✅ **JWT** para tokens de autenticación  
✅ **Variables de entorno** para configuración  
✅ **Validación de datos** con class-validator  
✅ **Guards** para proteger rutas  
✅ **DTOs** para validación de entrada  

## Estructura de Archivos

```
src/auth/
├── entities/
│   └── user.entity.ts          # Entidad User con TypeORM
├── dto/
│   ├── login.dto.ts            # DTO para login
│   └── register.dto.ts         # DTO para registro
├── auth.service.new.ts         # Servicio de autenticación completo
├── auth.controller.new.ts      # Controlador con todos los endpoints
├── auth.module.new.ts          # Módulo de autenticación
└── jwt-auth.guard.ts           # Guard para proteger rutas
```

## Configuración

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=10.8.2.226
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=$ignos1234
DB_DATABASE=DbSolicitudEfectivo

# JWT Configuration
JWT_SECRET=tu_super_secreto_jwt_muy_seguro_2024
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 2. Base de Datos

Ejecutar el script SQL para crear la tabla `users`:

```sql
-- Ver archivo: src/database/create-users-table.sql
```

## Endpoints Disponibles

### 🔐 Autenticación

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ |
| POST | `/auth/login` | Iniciar sesión | ❌ |
| GET | `/auth/profile` | Obtener perfil del usuario | ✅ |
| GET | `/auth/me` | Información del usuario actual | ✅ |
| POST | `/auth/validate` | Validar credenciales | ❌ |
| GET | `/auth/test` | Probar que el controlador funciona | ❌ |

### 📝 Ejemplos de Uso

#### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true
  }
}
```

#### 3. Obtener Perfil (Protegido)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "message": "Perfil obtenido exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true
  }
}
```

## Funcionalidades del AuthService

### Métodos Principales

1. **`register(registerDto)`** - Registra usuario con contraseña encriptada
2. **`login(loginDto)`** - Valida credenciales y genera JWT
3. **`validateUser(email, password)`** - Valida credenciales sin generar token
4. **`findById(id)`** - Busca usuario por ID
5. **`findByEmail(email)`** - Busca usuario por email
6. **`updatePassword(userId, newPassword)`** - Actualiza contraseña
7. **`deactivateUser(userId)`** - Desactiva usuario
8. **`findAllUsers()`** - Lista todos los usuarios (solo admin)

### Seguridad

- ✅ Contraseñas encriptadas con bcrypt (10 salt rounds)
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de datos con class-validator
- ✅ Protección de rutas con JwtAuthGuard
- ✅ Exclusión de contraseñas en respuestas
- ✅ Manejo de errores centralizado

## Instalación y Uso

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp env.example .env
# Editar .env con tus valores
```

### 3. Crear Tabla en Base de Datos

```bash
# Ejecutar el script SQL en tu base de datos
# Ver: src/database/create-users-table.sql
```

### 4. Ejecutar la Aplicación

```bash
npm start
```

### 5. Probar Endpoints

```bash
# Probar que funciona
curl http://localhost:3000/auth/test

# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Iniciar sesión
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Roles de Usuario

- **`admin`** - Acceso completo
- **`manager`** - Acceso limitado
- **`user`** - Acceso básico (por defecto)

## Notas Importantes

1. **Sincronización de Base de Datos**: En desarrollo, TypeORM puede crear/actualizar tablas automáticamente
2. **Secret Key**: Cambiar `JWT_SECRET` en producción
3. **Expiración de Tokens**: Configurar `JWT_EXPIRES_IN` según necesidades
4. **Logs**: Habilitados en desarrollo para debugging

## Próximos Pasos

- [ ] Implementar refresh tokens
- [ ] Agregar rate limiting
- [ ] Implementar 2FA
- [ ] Agregar logs de auditoría
- [ ] Implementar recuperación de contraseña 