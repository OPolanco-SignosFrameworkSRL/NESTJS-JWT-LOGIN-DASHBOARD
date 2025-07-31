export declare const appConfig: (() => {
    name: string;
    version: string;
    port: number;
    environment: string;
    isProduction: boolean;
    isDevelopment: boolean;
    cors: {
        origin: string;
        credentials: boolean;
    };
    swagger: {
        title: string;
        description: string;
        version: string;
        path: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    name: string;
    version: string;
    port: number;
    environment: string;
    isProduction: boolean;
    isDevelopment: boolean;
    cors: {
        origin: string;
        credentials: boolean;
    };
    swagger: {
        title: string;
        description: string;
        version: string;
        path: string;
    };
}>;
