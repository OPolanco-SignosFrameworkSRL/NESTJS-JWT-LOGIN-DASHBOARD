"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWrite = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let UserWrite = class UserWrite {
    getFullName() {
        return `${this.nombre} ${this.apellido}`.trim();
    }
    getApellido() {
        return `${this.apellido}`.trim();
    }
    isActive() {
        return this.valido;
    }
    hasRole(role) {
        return this.role === role;
    }
};
exports.UserWrite = UserWrite;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del usuario',
        example: 62154,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserWrite.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cédula del usuario (11 dígitos)',
        example: '40245980129',
        minLength: 11,
        maxLength: 11,
    }),
    (0, typeorm_1.Column)({ length: 11 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], UserWrite.prototype, "cedula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Raul',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UserWrite.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Vargas',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UserWrite.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hash SHA-256 del código de usuario',
        example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
    }),
    (0, typeorm_1.Column)({ length: 64 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserWrite.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario (se almacena hasheada)',
        example: 'password123',
    }),
    (0, typeorm_1.Column)({ length: 64 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserWrite.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario en el sistema',
        example: 'Usuario',
        enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
        default: 'Usuario',
    }),
    (0, typeorm_1.Column)({ length: 50, default: 'Usuario' }),
    __metadata("design:type", String)
], UserWrite.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'Raul.Vargas@grupoastro.com.do',
        maxLength: 255,
    }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], UserWrite.prototype, "user_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el usuario está activo',
        example: true,
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserWrite.prototype, "valido", void 0);
exports.UserWrite = UserWrite = __decorate([
    (0, typeorm_1.Entity)('appusuarios'),
    (0, typeorm_1.Index)(['cedula'], { unique: true })
], UserWrite);
//# sourceMappingURL=user-write.entity.js.map