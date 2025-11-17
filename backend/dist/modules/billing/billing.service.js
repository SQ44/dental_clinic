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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
const billing_item_entity_1 = require("./billing-item.entity");
let BillingService = class BillingService {
    invoiceRepository;
    billingItemRepository;
    constructor(invoiceRepository, billingItemRepository) {
        this.invoiceRepository = invoiceRepository;
        this.billingItemRepository = billingItemRepository;
    }
    async createInvoice(createInvoiceDto) {
        const invoice = this.invoiceRepository.create({
            ...createInvoiceDto,
            totalAmount: 0,
        });
        return this.invoiceRepository.save(invoice);
    }
    async findAllInvoices() {
        return this.invoiceRepository.find({
            relations: ['patient', 'appointment'],
        });
    }
    async findOneInvoice(id) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['patient', 'appointment', 'billingItems'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async updateInvoice(id, updateInvoiceDto) {
        const invoice = await this.findOneInvoice(id);
        Object.assign(invoice, updateInvoiceDto);
        return this.invoiceRepository.save(invoice);
    }
    async removeInvoice(id) {
        const invoice = await this.findOneInvoice(id);
        await this.invoiceRepository.remove(invoice);
    }
    async createBillingItem(createBillingItemDto) {
        const quantity = createBillingItemDto.quantity ?? 1;
        const total = quantity * createBillingItemDto.unitPrice;
        const billingItem = this.billingItemRepository.create({
            ...createBillingItemDto,
            quantity,
            total,
        });
        const savedItem = await this.billingItemRepository.save(billingItem);
        await this.updateInvoiceTotal(savedItem.invoiceId);
        return savedItem;
    }
    async findBillingItemsByInvoice(invoiceId) {
        return this.billingItemRepository.find({
            where: { invoiceId },
        });
    }
    async findOneBillingItem(id) {
        const item = await this.billingItemRepository.findOne({
            where: { id },
            relations: ['invoice'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Billing item with ID ${id} not found`);
        }
        return item;
    }
    async updateBillingItem(id, updateBillingItemDto) {
        const item = await this.findOneBillingItem(id);
        Object.assign(item, updateBillingItemDto);
        if (updateBillingItemDto.quantity !== undefined || updateBillingItemDto.unitPrice !== undefined) {
            item.total = (updateBillingItemDto.quantity ?? item.quantity) * (updateBillingItemDto.unitPrice ?? item.unitPrice);
        }
        const savedItem = await this.billingItemRepository.save(item);
        await this.updateInvoiceTotal(savedItem.invoiceId);
        return savedItem;
    }
    async removeBillingItem(id) {
        const item = await this.findOneBillingItem(id);
        const invoiceId = item.invoiceId;
        await this.billingItemRepository.remove(item);
        await this.updateInvoiceTotal(invoiceId);
    }
    async updateInvoiceTotal(invoiceId) {
        const items = await this.billingItemRepository.find({
            where: { invoiceId },
            select: ['total'],
        });
        const total = items.reduce((sum, item) => sum + parseFloat(item.total.toString()), 0);
        await this.invoiceRepository.update(invoiceId, { totalAmount: total });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(billing_item_entity_1.BillingItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map