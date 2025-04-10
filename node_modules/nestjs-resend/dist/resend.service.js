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
exports.ResendService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
const resend_constant_1 = require("./resend.constant");
let ResendService = class ResendService extends resend_1.Resend {
    constructor(options) {
        if (!(options && options.apiKey)) {
            return;
        }
        super(options.apiKey);
        this.options = options;
        this.send = async (payload, options) => this.emails.send(payload, options);
        this.sendBatch = async (payload, options) => this.batch.send(payload, options);
    }
};
exports.ResendService = ResendService;
exports.ResendService = ResendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(resend_constant_1.RESEND_CONFIGURATION_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ResendService);
//# sourceMappingURL=resend.service.js.map