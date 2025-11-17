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
exports.Dentist = void 0;
const typeorm_1 = require("typeorm");
let Dentist = class Dentist {
    id;
    firstName;
    lastName;
    email;
    specialty;
    licenseNumber;
    createdAt;
};
exports.Dentist = Dentist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Dentist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 50 }),
    __metadata("design:type", String)
], Dentist.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 50 }),
    __metadata("design:type", String)
], Dentist.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Dentist.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Dentist.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_number', length: 50, unique: true, nullable: true }),
    __metadata("design:type", String)
], Dentist.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Dentist.prototype, "createdAt", void 0);
exports.Dentist = Dentist = __decorate([
    (0, typeorm_1.Entity)('dentists')
], Dentist);
//# sourceMappingURL=dentist.entity.js.map