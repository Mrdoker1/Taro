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
  // статичные домены из .env (без пробелов)
  const staticOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // динамичные домены VK Mini Apps (prod/stage, pages и pages-ac)
  const vkHosts = [
    /^https:\/\/(prod|stage)-app\d+(?:-[a-z0-9]+)?\.pages(?:-ac)?\.vk-apps\.com$/,
  ];

  console.log('CORS static origins:', staticOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl/postman и пр.

      const allowed =
        staticOrigins.includes(origin) || vkHosts.some(re => re.test(origin));

      return allowed
        ? callback(null, true)
        : callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
