"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserDtoExample = exports.createUserDtoExample = void 0;
const roles_1 = require("../roles");
exports.createUserDtoExample = {
    summary: 'Пример регистрации',
    value: {
        username: 'user',
        email: 'user@example.com',
        password: 'user',
        role: roles_1.Roles.USER,
    },
};
exports.loginUserDtoExample = {
    summary: 'Пример авторизации',
    value: {
        username: 'user',
        password: 'user',
    },
};
//# sourceMappingURL=examples.js.map