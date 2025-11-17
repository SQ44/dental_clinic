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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
const create_billing_item_dto_1 = require("./dto/create-billing-item.dto");
const update_billing_item_dto_1 = require("./dto/update-billing-item.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    createInvoice(createInvoiceDto) {
        return this.billingService.createInvoice(createInvoiceDto);
    }
    findAllInvoices() {
        return this.billingService.findAllInvoices();
    }
    findOneInvoice(id) {
        return this.billingService.findOneInvoice(id);
    }
    updateInvoice(id, updateInvoiceDto) {
        return this.billingService.updateInvoice(id, updateInvoiceDto);
    }
    removeInvoice(id) {
        return this.billingService.removeInvoice(id);
    }
    createBillingItem(invoiceId, createBillingItemDto) {
        return this.billingService.createBillingItem({ ...createBillingItemDto, invoiceId });
    }
    findBillingItemsByInvoice(invoiceId) {
        return this.billingService.findBillingItemsByInvoice(invoiceId);
    }
    updateBillingItem(id, updateBillingItemDto) {
        return this.billingService.updateBillingItem(id, updateBillingItemDto);
    }
    removeBillingItem(id) {
        return this.billingService.removeBillingItem(id);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('invoices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "findOneInvoice", null);
__decorate([
    (0, common_1.Patch)('invoices/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_invoice_dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('invoices/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "removeInvoice", null);
__decorate([
    (0, common_1.Post)('invoices/:invoiceId/items'),
    __param(0, (0, common_1.Param)('invoiceId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_billing_item_dto_1.CreateBillingItemDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createBillingItem", null);
__decorate([
    (0, common_1.Get)('invoices/:invoiceId/items'),
    __param(0, (0, common_1.Param)('invoiceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "findBillingItemsByInvoice", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_billing_item_dto_1.UpdateBillingItemDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "updateBillingItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "removeBillingItem", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map