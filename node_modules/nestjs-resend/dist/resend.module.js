"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResendModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendModule = void 0;
const common_1 = require("@nestjs/common");
const resend_core_module_1 = require("./resend-core.module");
let ResendModule = ResendModule_1 = class ResendModule {
    static forRoot(options) {
        return {
            module: ResendModule_1,
            imports: [resend_core_module_1.ResendCoreModule.forRoot(options)],
        };
    }
    static forRootAsync(options) {
        return {
            module: ResendModule_1,
            imports: [resend_core_module_1.ResendCoreModule.forRootAsync(options)],
        };
    }
};
exports.ResendModule = ResendModule;
exports.ResendModule = ResendModule = ResendModule_1 = __decorate([
    (0, common_1.Module)({})
], ResendModule);
//# sourceMappingURL=resend.module.js.map