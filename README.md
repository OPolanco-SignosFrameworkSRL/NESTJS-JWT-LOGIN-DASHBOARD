# 💰 SolicitudEfectivo

Sistema completo de gestión de solicitudes de efectivo desarrollado con **NestJS** (backend) y **React** (frontend). Permite a los usuarios crear, gestionar y aprobar solicitudes de efectivo con un sistema de roles y autenticación JWT.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Cómo Ejecutar](#-cómo-ejecutar)
- [API Endpoints](#-api-endpoints)
- [Arquitectura](#-arquitectura)
- [Base de Datos](#-base-de-datos)
- [Docker](#-docker)
- [Scripts Útiles](#-scripts-útiles)
- [Contribución](#-contribución)

## ✨ Características

### 🔐 Autenticación y Autorización
- Autenticación JWT con roles de usuario
- Sistema de roles: **Admin**, **Supervisor**, **Usuario**
- Protección de rutas basada en permisos
- Encriptación segura de contraseñas con bcrypt

### 💼 Gestión de Solicitudes
- **Crear solicitudes** de efectivo con detalles completos
- **Aprobar/Rechazar** solicitudes (Admin/Supervisor)
- **Seguimiento del estado** de solicitudes en tiempo real
- **Historial completo** de cambios y comentarios
- **Filtros avanzados** y paginación

### 👥 Gestión de Usuarios
- CRUD completo de usuarios
- Asignación de roles y permisos
- Filtros por división, rol y estado
- Paginación de resultados

### 💬 Sistema de Comentarios
- Comentarios en solicitudes
- Historial de interacciones
- Notificaciones de cambios

### 📊 Desembolsos
- Gestión de desembolsos de efectivo
- Seguimiento de pagos
- Estados de desembolso

## 📁 Estructura del Proyecto

```
SolicitudEfectivo/
├── 📂 solicitud-efectivo-backend/     # API Backend (NestJS)
│   ├── 📂 src/
│   │   ├── 📂 core/                   # Lógica de negocio (Clean Architecture)
│   │   │   ├── 📂 application/        # Casos de uso y DTOs
│   │   │   └── 📂 domain/             # Entidades y servicios
│   │   ├── 📂 infrastructure/         # Persistencia y servicios externos
│   │   │   ├── 📂 database/           # Entidades TypeORM
│   │   │   ├── 📂 repositories/       # Implementación de repositorios
│   │   │   └── 📂 services/           # Servicios de infraestructura
│   │   ├── 📂 presentation/           # Capa de presentación
│   │   │   ├── 📂 controllers/        # Controladores REST
│   │   │   ├── 📂 guards/             # Guards de autenticación
│   │   │   └── 📂 modules/            # Módulos de NestJS
│   │   ├── 📂 config/                 # Configuraciones de la app
│   │   └── 📂 scripts/                # Scripts de utilidad
│   ├── 📄 docker-compose.yml          # Configuración Docker
│   ├── 📄 Dockerfile                  # Imagen Docker
│   └── 📄 package.json                # Dependencias Backend
│
└── 📂 solicitud-efectivo-frontend/    # Aplicación Frontend (React)
    ├── 📂 src/
    │   ├── 📂 application/            # Lógica de aplicación
    │   │   ├── 📂 components/         # Componentes React
    │   │   ├── 📂 pages/              # Páginas de la aplicación
    │   │   ├── 📂 hooks/              # Custom hooks
    │   │   ├── 📂 store/              # Estado global (Zustand)
    │   │   └── 📂 router/             # Configuración de rutas
    │   ├── 📂 infrastructure/         # Servicios API y esquemas
    │   └── 📂 shared/                 # Utilidades compartidas
    └── 📄 package.json                # Dependencias Frontend
```

## 🛠 Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Swagger** - Documentación de API
- **SQL Server** - Base de datos

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Query** - Gestión de estado del servidor
- **Zustand** - Estado global
- **React Hook Form** - Gestión de formularios
- **React Router** - Navegación

## 📋 Requisitos del Sistema

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 o **pnpm** >= 7.0.0
- **SQL Server** 2019 o superior
- **Docker** (opcional)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Signos-Framework-SRL/SolicitudEfectivo.git
cd SolicitudEfectivo
```

### 2. Configurar Backend
```bash
cd solicitud-efectivo-backend
npm install
# o
pnpm install
```

### 3. Configurar Frontend
```bash
cd ../solicitud-efectivo-frontend
npm install
# o
pnpm install
```

## 🔧 Variables de Entorno

### Backend (.env)
Crear archivo `.env` en `solicitud-efectivo-backend/`:

```env
# Base de datos
DB_HOST=192.168.0.236
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=$ignos1234
DB_DATABASE=DbSolicitudEfectivo_v1
DB_LOGGING=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Aplicación
NODE_ENV=development
PORT=3000
```

### Frontend (.env)
Crear archivo `.env` en `solicitud-efectivo-frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

## ▶️ Cómo Ejecutar

### Desarrollo Local

#### Backend
```bash
cd solicitud-efectivo-backend
npm run start:dev
```
El backend estará disponible en: `http://localhost:3000`
Swagger UI: `http://localhost:3000/api/docs`

#### Frontend
```bash
cd solicitud-efectivo-frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### Producción con Docker
```bash
cd solicitud-efectivo-backend
docker-compose up -d
```

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Usuarios
- `GET /users` - Obtener usuarios (paginado)
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Solicitudes de Efectivo
- `GET /cash-requests` - Obtener solicitudes (paginado)
- `POST /cash-requests` - Crear nueva solicitud
- `GET /cash-requests/:id` - Obtener solicitud por ID
- `PUT /cash-requests/:id` - Actualizar solicitud
- `GET /cash-requests/my-requests` - Mis solicitudes

### Roles
- `GET /roles` - Obtener roles
- `POST /roles` - Crear rol
- `PUT /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

### Comentarios
- `GET /comments/:requestId` - Obtener comentarios de solicitud
- `POST /comments` - Crear comentario

### Desembolsos
- `GET /desembolsos` - Obtener desembolsos
- `POST /desembolsos` - Crear desembolso

## 🏗 Arquitectura

### Backend - Clean Architecture
El backend sigue los principios de **Clean Architecture**:

- **Core/Domain**: Lógica de negocio pura
- **Core/Application**: Casos de uso y DTOs
- **Infrastructure**: Implementaciones concretas
- **Presentation**: Controladores y módulos HTTP

### Patrones Utilizados
- **Repository Pattern** - Abstracción de datos
- **Use Case Pattern** - Lógica de aplicación
- **Dependency Injection** - Inversión de dependencias
- **Guard Pattern** - Protección de rutas

## 🗄 Base de Datos

### Entidades Principales
- **Usuarios** - Gestión de usuarios del sistema
- **Roles** - Roles y permisos
- **SolicitudesEfectivo** - Solicitudes de efectivo
- **Comentarios** - Comentarios en solicitudes
- **Desembolsos** - Registro de desembolsos

### Configuración
- Motor: **SQL Server 2019+**
- ORM: **TypeORM**
- Migraciones automáticas deshabilitadas
- Logging habilitado en desarrollo

## 🐳 Docker

### Desarrollo
```bash
cd solicitud-efectivo-backend
docker-compose up -d
```

### Servicios Incluidos
- **App** - Aplicación NestJS (Puerto 3000)
- **DB** - SQL Server 2019 (Puerto 1433)

### Volúmenes
- `mssql_data` - Persistencia de datos SQL Server

## 📝 Scripts Útiles

### Backend
```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con watch
npm run start:fast         # Desarrollo rápido

# Construcción
npm run build              # Construir para producción
npm run start              # Iniciar producción

# Testing
npm run test               # Tests unitarios
npm run test:watch         # Tests en modo watch
npm run test:cov           # Coverage

# Linting
npm run lint               # ESLint
npm run format             # Prettier

# Base de datos
npm run check-db           # Verificar conexión DB
```

### Frontend
```bash
npm run dev                # Desarrollo
npm run build              # Construir para producción
npm run preview            # Vista previa de producción
npm run lint               # ESLint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convenciones de Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formateo
- `refactor:` - Refactorización
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ por [Signos Framework SRL](https://github.com/Signos-Framework-SRL)**

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:

1. Revisa la [documentación de la API](http://localhost:3000/api/docs)
2. Abre un [issue](https://github.com/Signos-Framework-SRL/SolicitudEfectivo/issues)
3. Contacta al equipo de desarrollo

---

### 🎯 Estado del Proyecto
- ✅ Backend API completa
- ✅ Frontend funcional
- ✅ Autenticación y autorización
- ✅ CRUD de solicitudes
- ✅ Sistema de comentarios
- ✅ Gestión de roles
- ✅ Docker configurado
- ✅ Documentación Swagger
