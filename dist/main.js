"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const serverConfig_1 = require("./utils/serverConfig");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    configureCors(app);
    setupSwagger(app);
    const { port, server } = (0, serverConfig_1.getServerConfig)();
    console.log(`Server is running on: http://${server}:${port}`);
    console.log(`Swagger docs available on: http://${server}:${port}/api`);
    await app.listen(port, server);
}
function configureCors(app) {
    app.enableCors({
        origin: `http://${process.env.CLIENT}`,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
}
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Taro App API')
        .setDescription('REST API для сервиса Taro App')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
}
bootstrap().catch((error) => {
    console.error('Error during bootstrap:', error);
});
//# sourceMappingURL=main.js.map