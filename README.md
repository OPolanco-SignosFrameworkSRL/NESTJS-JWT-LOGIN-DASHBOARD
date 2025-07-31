# API de Solicitud de Efectivo

API RESTful para gestión de solicitudes de efectivo con autenticación JWT y TypeORM.

## 🚀 Características

- **Autenticación JWT**: Sistema de autenticación seguro con tokens JWT
- **Gestión de Usuarios**: CRUD completo para usuarios del sistema
- **Autorización por Roles**: Control de acceso basado en roles (Admin, Usuario, Supervisor, Manager)
- **Base de Datos SQL Server**: Integración con Microsoft SQL Server
- **Documentación API**: Swagger/OpenAPI integrado
- **Validación de Datos**: Validación robusta con class-validator
- **Logging**: Sistema de logging estructurado
- **Configuración Flexible**: Configuración por variables de entorno
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Frontend Integrado**: Interfaz web incluida

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Microsoft SQL Server
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd nestjs-jwt-login-dashboard
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   # Base de datos
   DB_HOST=tu-servidor-sql
   DB_PORT=1433
   DB_USERNAME=tu-usuario
   DB_PASSWORD=tu-contraseña
   DB_DATABASE=tu-base-de-datos
   
   # JWT
   JWT_SECRET=tu-clave-secreta-super-segura
   
   # Aplicación
   PORT=3000
   NODE_ENV=development
   ```

4. **Ejecutar migraciones** (si es necesario)
   ```bash
   npm run migration:run
   ```

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start
```

### Con logs preservados
```bash
npm run start:fast
```

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api
```

## 🔐 Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "cedula": "40245980129",
  "password": "cualquier-password"
}
```

### Respuesta
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "cedula": "40245980129",
    "fullname": "Raul Vargas",
    "role": "Usuario",
    "user_email": "raul.vargas@grupoastro.com.do"
  },
  "expires_in": 86400
}
```

### Uso del Token
```http
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Gestión de Usuarios

### Crear Usuario (Solo Admin)
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "cedula": "40245980129",
  "nombre": "Raul",
  "apellido": "Vargas",
  "role": "Usuario",
  "user_email": "raul.vargas@grupoastro.com.do",
  "division": "TI",
  "cargo": "Desarrollador",
  "dependencia": "Sistemas",
  "recinto": "Santo Domingo",
  "estado": "ACTIVO"
}
```

### Obtener Usuarios
```http
GET /users
GET /users?role=Usuario
GET /users?division=TI
GET /users?search=Raul
GET /users?active=true
```

### Obtener Estadísticas
```http
GET /users/stats
Authorization: Bearer <token>
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── controllers/         # Controladores de auth
│   ├── dto/                # DTOs de autenticación
│   ├── guards/             # Guards de autenticación
│   ├── services/           # Servicios de auth
│   └── strategies/         # Estrategias de Passport
├── common/                 # Código compartido
│   ├── constants/          # Constantes de la aplicación
│   ├── decorators/         # Decoradores personalizados
│   ├── filters/            # Filtros de excepción
│   ├── guards/             # Guards de autorización
│   ├── interceptors/       # Interceptores
│   ├── interfaces/         # Interfaces TypeScript
│   ├── services/           # Servicios compartidos
│   └── utils/              # Utilidades
├── config/                 # Configuraciones
│   ├── app.config.ts       # Configuración de la app
│   ├── database.config.ts  # Configuración de BD
│   └── jwt.config.ts       # Configuración JWT
├── entities/               # Entidades de TypeORM
│   └── user.entity.ts      # Entidad de usuario
├── users/                  # Módulo de usuarios
│   ├── controllers/        # Controladores de usuarios
│   ├── dto/               # DTOs de usuarios
│   └── services/          # Servicios de usuarios
├── frontend/              # Frontend integrado
├── app.controller.ts      # Controlador principal
├── app.module.ts          # Módulo principal
└── main.ts               # Punto de entrada
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de la base de datos | `10.8.2.226` |
| `DB_PORT` | Puerto de la base de datos | `1433` |
| `DB_USERNAME` | Usuario de la BD | `sa` |
| `DB_PASSWORD` | Contraseña de la BD | `$ignos1234` |
| `DB_DATABASE` | Nombre de la BD | `DbSolicitudEfectivo` |
| `JWT_SECRET` | Clave secreta JWT | `tu_clave_secreta_aqui` |
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT | `24h` |

### Roles de Usuario

- **Admin**: Acceso completo al sistema
- **Usuario**: Acceso básico
- **Supervisor**: Acceso intermedio con estadísticas
- **Manager**: Acceso de gestión

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📦 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `start` | Inicia la aplicación en modo producción |
| `start:dev` | Inicia la aplicación en modo desarrollo con hot reload |
| `start:fast` | Inicia con logs preservados |
| `build` | Compila el proyecto |
| `test` | Ejecuta tests unitarios |
| `test:watch` | Ejecuta tests en modo watch |
| `test:cov` | Ejecuta tests con coverage |
| `test:e2e` | Ejecuta tests end-to-end |

## 🔒 Seguridad

- **JWT**: Tokens con expiración configurable
- **Validación**: Validación robusta de entrada de datos
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Roles**: Control de acceso basado en roles
- **Logging**: Logging de eventos de seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de la API en `/api`
2. Verifica los logs de la aplicación
3. Abre un issue en el repositorio

## 🔄 Changelog

### v1.0.0
- ✅ Sistema de autenticación JWT
- ✅ Gestión completa de usuarios
- ✅ Documentación Swagger
- ✅ Configuración flexible
- ✅ Logging estructurado
- ✅ Validación robusta
- ✅ Frontend integrado
