export const APP_CONSTANTS = {
  // Configuración de la aplicación
  APP_NAME: 'API de Solicitud de Efectivo',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'API para gestión de solicitudes de efectivo - Grupo Astro',

  // Configuración de autenticación
  AUTH: {
    CLAVE_FIJA: 'Hola123',
    HASH_ALGORITHM: 'sha256',
    DEFAULT_ROLE: 'Usuario',
    DEFAULT_EMAIL_DOMAIN: '@grupoastro.com.do',
  },

  // Configuración de base de datos
  DATABASE: {
    VIEW_NAME: 'vappusuarios',
    USERS_TABLE: 'appusuarios',
    COLLABORATORS_TABLE: 'ga_colaboradores',
    PREFERENCES_TABLE: 'usuarios_preferences',
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Configuración de validación
  VALIDATION: {
    CEDULA_LENGTH: 11,
    MIN_PASSWORD_LENGTH: 1,
    MAX_NAME_LENGTH: 100,
    MAX_EMAIL_LENGTH: 255,
  },

  // Mensajes de error
  ERROR_MESSAGES: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    USER_ALREADY_EXISTS: 'El usuario ya existe',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    VALIDATION_ERROR: 'Error de validación',
    INTERNAL_ERROR: 'Error interno del servidor',
  },

  // Mensajes de éxito
  SUCCESS_MESSAGES: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente',
    LOGIN_SUCCESS: 'Login exitoso',
    LOGOUT_SUCCESS: 'Logout exitoso',
  },
} as const;
