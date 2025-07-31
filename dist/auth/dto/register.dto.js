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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_interface_1 = require("../../common/interfaces/user.interface");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cédula del usuario (11 dígitos)',
        example: '40245980129',
        minLength: 11,
        maxLength: 11,
    }),
    (0, class_validator_1.IsString)({ message: 'La cédula debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La cédula es requerida' }),
    (0, class_validator_1.Length)(11, 11, { message: 'La cédula debe tener exactamente 11 dígitos' }),
    (0, class_validator_1.Matches)(/^\d{11}$/, { message: 'La cédula debe contener solo números' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "cedula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Raul',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.Length)(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Vargas',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: 'El apellido debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es requerido' }),
    (0, class_validator_1.Length)(2, 100, {
        message: 'El apellido debe tener entre 2 y 100 caracteres',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario',
        example: 'password123',
        minLength: 4,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.Length)(4, 50, {
        message: 'La contraseña debe tener entre 4 y 50 caracteres',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clave dinámica proporcionada por el usuario (requerida)',
        example: 'MiClaveSecreta2024',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)({ message: 'La clave debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La clave es requerida' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "clave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario en el sistema',
        example: 'Usuario',
        enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
        default: 'Usuario',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_interface_1.UserRole, {
        message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'raul.vargas@grupoastro.com.do',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener un formato válido' }),
    (0, class_validator_1.Length)(5, 255, { message: 'El email debe tener entre 5 y 255 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "user_email", void 0);
//# sourceMappingURL=register.dto.js.map