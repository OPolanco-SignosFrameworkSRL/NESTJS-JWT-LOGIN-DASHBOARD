"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONSTANTS = void 0;
exports.APP_CONSTANTS = {
    APP_NAME: 'API de Solicitud de Efectivo',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'API para gestión de solicitudes de efectivo - Grupo Astro',
    AUTH: {
        CLAVE_FIJA: 'Hola123',
        HASH_ALGORITHM: 'sha256',
        DEFAULT_ROLE: 'Usuario',
        DEFAULT_EMAIL_DOMAIN: '@grupoastro.com.do',
    },
    DATABASE: {
        VIEW_NAME: 'vappusuarios',
        USERS_TABLE: 'appusuarios',
        COLLABORATORS_TABLE: 'ga_colaboradores',
        PREFERENCES_TABLE: 'usuarios_preferences',
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },
    VALIDATION: {
        CEDULA_LENGTH: 11,
        MIN_PASSWORD_LENGTH: 1,
        MAX_NAME_LENGTH: 100,
        MAX_EMAIL_LENGTH: 255,
    },
    ERROR_MESSAGES: {
        USER_NOT_FOUND: 'Usuario no encontrado',
        INVALID_CREDENTIALS: 'Credenciales inválidas',
        USER_ALREADY_EXISTS: 'El usuario ya existe',
        UNAUTHORIZED: 'No autorizado',
        FORBIDDEN: 'Acceso denegado',
        VALIDATION_ERROR: 'Error de validación',
        INTERNAL_ERROR: 'Error interno del servidor',
    },
    SUCCESS_MESSAGES: {
        USER_CREATED: 'Usuario creado exitosamente',
        USER_UPDATED: 'Usuario actualizado exitosamente',
        USER_DELETED: 'Usuario eliminado exitosamente',
        LOGIN_SUCCESS: 'Login exitoso',
        LOGOUT_SUCCESS: 'Logout exitoso',
    },
};
//# sourceMappingURL=app.constants.js.map