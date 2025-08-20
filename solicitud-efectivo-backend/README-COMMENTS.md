# Sistema de Comentarios para Solicitudes

## Descripción

Este sistema permite a usuarios y administradores agregar comentarios a las solicitudes de efectivo. Los usuarios solo pueden comentar en sus propias solicitudes, mientras que los administradores pueden comentar en cualquier solicitud.

## Características

- ✅ **CRUD completo de comentarios**
- ✅ **Control de permisos por rol**
- ✅ **Validación de datos**
- ✅ **Documentación con Swagger**
- ✅ **Arquitectura limpia**

## Estructura de la Base de Datos

La tabla `solicitud_desembolso_web_comentarios` tiene la siguiente estructura:

```sql
CREATE TABLE solicitud_desembolso_web_comentarios (
    id INT PRIMARY KEY IDENTITY(1,1),
    fechacreado DATETIME NOT NULL,
    creadoporid INT NOT NULL,
    solicitudid INT NOT NULL,
    creadopor_cedula VARCHAR(50) NOT NULL,
    comentario VARCHAR(MAX) NOT NULL
);
```

## Endpoints de la API

### 1. Crear/Actualizar Comentario
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": 1,
  "comment": "Este es un comentario sobre la solicitud"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentario creado exitosamente",
  "data": {
    "id": 1,
    "fechacreado": "2024-01-10T08:00:00.000Z",
    "creadoporid": 1,
    "solicitudid": 1,
    "creadopor_cedula": "12345678",
    "comentario": "Este es un comentario sobre la solicitud"
  }
}
```

### 2. Obtener Comentario del Usuario
```http
GET /comments/user/1
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentario obtenido exitosamente",
  "data": {
    "id": 1,
    "fechacreado": "2024-01-10T08:00:00.000Z",
    "creadoporid": 1,
    "solicitudid": 1,
    "creadopor_cedula": "12345678",
    "comentario": "Este es un comentario sobre la solicitud"
  }
}
```

### 3. Obtener Todos los Comentarios (Solo Admins)
```http
GET /comments/request/1
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "fechacreado": "2024-01-10T08:00:00.000Z",
      "creadoporid": 1,
      "solicitudid": 1,
      "creadopor_cedula": "12345678",
      "comentario": "Este es un comentario sobre la solicitud",
      "usuario": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan.perez@empresa.com"
      }
    }
  ]
}
```

### 4. Eliminar Comentario (Marcar como vacío)
```http
DELETE /comments/1
Authorization: Bearer <token>
```

**Nota:** Solo el autor del comentario puede eliminarlo. Los administradores NO pueden eliminar comentarios.

**Respuesta:**
```json
{
  "success": true,
  "message": "Comentario eliminado exitosamente",
  "data": {
    "id": 1,
    "fechacreado": "2024-01-10T08:00:00.000Z",
    "creadoporid": 1,
    "solicitudid": 1,
    "creadopor_cedula": "12345678",
    "comentario": ""
  }
}
```

## Reglas de Negocio

### Permisos por Rol

1. **Usuarios Normales:**
   - Solo pueden comentar en sus propias solicitudes
   - Solo pueden ver su propio comentario en cada solicitud
   - Solo pueden "eliminar" su propio comentario (marcarlo como vacío)

2. **Administradores:**
   - Pueden comentar en cualquier solicitud
   - Pueden ver todos los comentarios de todas las solicitudes
   - **NO pueden modificar ni eliminar comentarios** (solo pueden crear)

### Comportamiento del Comentario

- **Un comentario por usuario por solicitud**: Cada usuario puede tener solo un comentario por solicitud
- **Crear/Actualizar**: El mismo endpoint crea o actualiza el comentario del usuario
- **Eliminar**: Se marca como vacío en lugar de borrar de la base de datos
- **Persistencia**: El comentario siempre está disponible hasta que se "elimine"

### Validaciones

- El comentario no puede exceder 4000 caracteres
- La solicitud debe existir
- El usuario debe tener permisos para comentar
- **Solo el autor puede "eliminar" comentarios** (los admins NO pueden eliminar)

## Estructura del Proyecto

```
src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── comment.entity.ts
│   │   ├── repositories/
│   │   │   └── comment.repository.interface.ts
│   │   ├── services/
│   │   │   └── comment.service.ts
│   │   └── comment.service.interface.ts
│   └── application/
│       ├── dto/
│       │   └── create-comment.dto.ts
│       └── use-cases/
│           ├── create-comment.use-case.ts
│           ├── get-comments.use-case.ts
│           ├── get-user-comment.use-case.ts
│           └── delete-comment.use-case.ts
├── infrastructure/
│   ├── database/
│   │   └── entities/
│   │       └── comment.entity.ts
│   └── repositories/
│       └── comment.repository.ts
└── presentation/
    ├── controllers/
    │   └── comment.controller.ts
    └── modules/
        └── comment.module.ts
```

## Cómo Usar

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos
Asegúrate de que la tabla `solicitud_desembolso_web_comentarios` existe en tu base de datos.

### 3. Ejecutar la Aplicación
```bash
npm run start:dev
```

### 4. Probar Endpoints
Puedes usar Swagger UI en `http://localhost:3000/api` para probar los endpoints.

### 5. Ejecutar Pruebas
```bash
npm run test:comments
```

## Ejemplos de Uso

### Frontend Integration

```javascript
// Crear comentario
const createComment = async (requestId, comment) => {
  const response = await fetch('/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ requestId, comment })
  });
  return response.json();
};

// Obtener comentarios
const getComments = async (requestId) => {
  const response = await fetch(`/comments/request/${requestId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Manejo de Errores

Los errores comunes incluyen:

- `400`: Datos inválidos o sin permisos
- `401`: No autorizado
- `403`: Sin permisos para la acción
- `404`: Recurso no encontrado

## Seguridad

- Todos los endpoints requieren autenticación JWT
- Validación de permisos por rol
- Sanitización de datos de entrada
- Protección contra inyección SQL (TypeORM)

## Contribución

1. Sigue la arquitectura limpia establecida
2. Agrega tests para nuevas funcionalidades
3. Documenta cambios en la API
4. Verifica permisos y validaciones
