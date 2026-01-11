import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getServerConfig } from './utils/serverConfig'; // Import the new utility
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Настройка сессий для course-editor
  app.use(
    session({
      secret: 'tarot-course-editor-secret-key-2024',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  // Увеличиваем лимит для загрузки файлов до 100MB (для очень больших фото с телефонов)
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Middleware для отлова ошибок размера запроса
  app.use((err, req, res, next) => {
    console.log(`=== ОШИБКА MIDDLEWARE ===`);
    console.log(`Тип ошибки: ${err.type || 'неизвестен'}`);
    console.log(`Сообщение: ${err.message}`);
    console.log(`Статус: ${err.status || err.statusCode}`);
    console.log(`========================`);

    if (err.type === 'entity.too.large') {
      return res.status(413).json({
        error: 'Файл или запрос слишком большой',
        message: 'Максимальный размер: 100MB',
        limit: '100MB',
      });
    }

    next(err);
  });

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
  setupStaticRoutes(app);

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
      // Разрешаем запросы без origin (Swagger UI, curl, postman, мобильные приложения)
      if (!origin) return callback(null, true);

      // В режиме разработки разрешаем все localhost запросы
      if (
        process.env.NODE_ENV !== 'production' &&
        (origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.includes('10.0.2.2'))
      ) {
        return callback(null, true);
      }

      const allowed =
        staticOrigins.includes(origin) || vkHosts.some(re => re.test(origin));

      return allowed
        ? callback(null, true)
        : callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
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

function setupStaticRoutes(app) {
  // Раздача статических файлов для страниц сброса пароля
  const templatesPath = path.join(__dirname, 'templates');
  app.use('/templates', express.static(templatesPath));
  console.log(`Static templates served from: ${templatesPath}`);

  // Раздача статических файлов для course-editor
  const courseEditorViewsPath = path.join(__dirname, 'course-editor', 'views');
  app.use('/course-editor/views', express.static(courseEditorViewsPath));
  console.log(`Course editor views served from: ${courseEditorViewsPath}`);
}

bootstrap().catch(error => {
  console.error('Error during bootstrap:', error);
});
