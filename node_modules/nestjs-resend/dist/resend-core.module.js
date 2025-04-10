"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResendCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendCoreModule = void 0;
const common_1 = require("@nestjs/common");
const resend_constant_1 = require("./resend.constant");
const resend_service_1 = require("./resend.service");
let ResendCoreModule = ResendCoreModule_1 = class ResendCoreModule {
    static forRoot(options) {
        const resendModuleOptions = {
            provide: resend_constant_1.RESEND_CONFIGURATION_OPTIONS,
            useValue: options,
        };
        return {
            module: ResendCoreModule_1,
            providers: [resendModuleOptions],
            exports: [resend_service_1.ResendService],
        };
    }
    static forRootAsync(options) {
        const resendModuleOptions = {
            provide: resend_constant_1.RESEND_CONFIGURATION_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
        return {
            module: ResendCoreModule_1,
            imports: options.imports,
            providers: [resendModuleOptions],
            exports: [resend_service_1.ResendService],
        };
    }
};
exports.ResendCoreModule = ResendCoreModule;
exports.ResendCoreModule = ResendCoreModule = ResendCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [resend_service_1.ResendService],
        exports: [resend_service_1.ResendService],
    })
], ResendCoreModule);
//# sourceMappingURL=resend-core.module.js.map