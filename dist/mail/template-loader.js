"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = loadTemplate;
exports.validateEmailTemplate = validateEmailTemplate;
const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");
async function loadTemplate(templateName, data) {
    try {
        const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
        const templateFile = await fs.readFile(filePath, 'utf8');
        const template = handlebars.compile(templateFile);
        return template(data);
    }
    catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
        throw new Error(`Could not load template ${templateName}`);
    }
}
async function validateEmailTemplate(templateName) {
    try {
        const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
        await fs.access(filePath);
    }
    catch (error) {
        console.error(`Error validating template ${templateName}:`, error);
        throw new Error(`Template ${templateName} does not exist, or is not accessible from it's root directory`);
    }
}
//# sourceMappingURL=template-loader.js.map