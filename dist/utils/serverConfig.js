"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerConfig = getServerConfig;
function getServerConfig() {
    return {
        port: process.env.PORT || 3000,
        server: process.env.SERVER || '0.0.0.0',
    };
}
//# sourceMappingURL=serverConfig.js.map