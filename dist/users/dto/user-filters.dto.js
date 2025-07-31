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
exports.UserFiltersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const user_interface_1 = require("../../common/interfaces/user.interface");
class UserFiltersDto {
}
exports.UserFiltersDto = UserFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario para filtrar',
        example: 'Usuario',
        enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_interface_1.UserRole, {
        message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
    }),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'División del usuario para filtrar',
        example: 'TI',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La división debe ser una cadena de texto' }),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Término de búsqueda (nombre, apellido o cédula)',
        example: 'Raul',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El término de búsqueda debe ser una cadena de texto' }),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtrar por usuarios activos/inactivos',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'El campo active debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], UserFiltersDto.prototype, "active", void 0);
//# sourceMappingURL=user-filters.dto.js.map