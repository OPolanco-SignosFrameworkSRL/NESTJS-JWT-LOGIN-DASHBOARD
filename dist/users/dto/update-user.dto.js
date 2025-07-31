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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_interface_1 = require("../../common/interfaces/user.interface");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Raul',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Vargas',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El apellido debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(2, 100, {
        message: 'El apellido debe tener entre 2 y 100 caracteres',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario en el sistema',
        example: 'Usuario',
        enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_interface_1.UserRole, {
        message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
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
], UpdateUserDto.prototype, "user_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'División del usuario',
        example: 'TI',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La división debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(1, 100, {
        message: 'La división debe tener entre 1 y 100 caracteres',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cargo del usuario',
        example: 'Desarrollador',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El cargo debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(1, 100, { message: 'El cargo debe tener entre 1 y 100 caracteres' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "cargo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dependencia del usuario',
        example: 'Sistemas',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La dependencia debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(1, 100, {
        message: 'La dependencia debe tener entre 1 y 100 caracteres',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dependencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recinto del usuario',
        example: 'Santo Domingo',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El recinto debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(1, 100, { message: 'El recinto debe tener entre 1 y 100 caracteres' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "recinto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del usuario',
        example: 'ACTIVO',
        maxLength: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El estado debe ser una cadena de texto' }),
    (0, class_validator_1.Length)(1, 50, { message: 'El estado debe tener entre 1 y 50 caracteres' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el usuario está activo',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'El campo valido debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "valido", void 0);
//# sourceMappingURL=update-user.dto.js.map