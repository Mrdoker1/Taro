import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getServerConfig } from './utils/serverConfig'; // Import the new utility
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Добавляем глобальную трансформацию
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true, // Удаляет свойства, которых нет в DTO
      forbidNonWhitelisted: false, // Не выбрасывает ошибку при лишних свойствах
    }),
  );

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
  // Получаем список разрешенных источников из переменной окружения или используем значения по умолчанию
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'https://mrdoker1.github.io/Taro-vk'];

  console.log('CORS allowed origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // Позволяет передавать cookies и заголовки Authorization
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
  });
}

function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Taro App API')
    .setDescription('REST API для сервиса Taro App')
    .setVersion('1.0')
    .addBearerAuth() // Добавляем поддержку Bearer-авторизации
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap().catch(error => {
  console.error('Error during bootstrap:', error);
});
