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
exports.LoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LoginDto {
}
exports.LoginDto = LoginDto;
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
], LoginDto.prototype, "cedula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario (se ignora en la validación actual)',
        example: 'password123',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
//# sourceMappingURL=login.dto.js.map