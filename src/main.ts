import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getServerConfig } from './utils/serverConfig'; // Import the new utility

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureCors(app);
  setupSwagger(app);

  const { port, server } = getServerConfig();

  // Логируем
  console.log(`Server is running on: http://${server}:${port}`);
  console.log(`Swagger docs available on: http://${server}:${port}/api`);

  // Слушаем на нужном порту и IP
  await app.listen(port, server);
}

function configureCors(app) {
  app.enableCors({
    origin: `http://${process.env.CLIENT}`, // Разрешаем запросы с фронтенда
    credentials: true, // Позволяет передавать cookies и заголовки Authorization
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
  });
}

function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Renault Club API')
    .setDescription('REST API для сервиса Renault Club')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
