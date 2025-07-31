export declare const APP_CONSTANTS: {
    readonly APP_NAME: "API de Solicitud de Efectivo";
    readonly APP_VERSION: "1.0.0";
    readonly APP_DESCRIPTION: "API para gestión de solicitudes de efectivo - Grupo Astro";
    readonly AUTH: {
        readonly CLAVE_FIJA: "Hola123";
        readonly HASH_ALGORITHM: "sha256";
        readonly DEFAULT_ROLE: "Usuario";
        readonly DEFAULT_EMAIL_DOMAIN: "@grupoastro.com.do";
    };
    readonly DATABASE: {
        readonly VIEW_NAME: "vappusuarios";
        readonly USERS_TABLE: "appusuarios";
        readonly COLLABORATORS_TABLE: "ga_colaboradores";
        readonly PREFERENCES_TABLE: "usuarios_preferences";
    };
    readonly PAGINATION: {
        readonly DEFAULT_PAGE: 1;
        readonly DEFAULT_LIMIT: 10;
        readonly MAX_LIMIT: 100;
    };
    readonly VALIDATION: {
        readonly CEDULA_LENGTH: 11;
        readonly MIN_PASSWORD_LENGTH: 1;
        readonly MAX_NAME_LENGTH: 100;
        readonly MAX_EMAIL_LENGTH: 255;
    };
    readonly ERROR_MESSAGES: {
        readonly USER_NOT_FOUND: "Usuario no encontrado";
        readonly INVALID_CREDENTIALS: "Credenciales inválidas";
        readonly USER_ALREADY_EXISTS: "El usuario ya existe";
        readonly UNAUTHORIZED: "No autorizado";
        readonly FORBIDDEN: "Acceso denegado";
        readonly VALIDATION_ERROR: "Error de validación";
        readonly INTERNAL_ERROR: "Error interno del servidor";
    };
    readonly SUCCESS_MESSAGES: {
        readonly USER_CREATED: "Usuario creado exitosamente";
        readonly USER_UPDATED: "Usuario actualizado exitosamente";
        readonly USER_DELETED: "Usuario eliminado exitosamente";
        readonly LOGIN_SUCCESS: "Login exitoso";
        readonly LOGOUT_SUCCESS: "Logout exitoso";
    };
};
