## Описание

Проект **Taro** — это серверное приложение, разработанное с использованием [NestJS](https://nestjs.com/), предназначенное для ...

### Основные возможности:
- **Авторизация и аутентификация**:
  - Регистрация пользователей с подтверждением email.
  - Авторизация с использованием JWT.
  - Роли пользователей (администратор и пользователь).
- **Email-уведомления**:
  - Отправка писем с использованием `nodemailer` и шаблонов Handlebars.
- **Документация API**:
  - Автоматическая генерация Swagger-документации.
- **Мониторинг состояния сервера**:
  - Эндпоинт для проверки состояния сервера.

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/your-repo/Taro.git
   cd Taro
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` в корне проекта и настройте переменные окружения:
   ```env
   JWT_SECRET=your_secret_key
   MONGO=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<DBname>?authSource=admin
   SERVER=localhost
   PORT=3000
   CLIENT=localhost:1234
   MAIL_HOST=smtp.ethereal.email
   MAIL_PORT=1234
   MAIL_USER=your_email
   MAIL_PASS=your_password
   ```

## Запуск проекта

### Режим разработки
```bash
npm run start:dev
```

### Режим продакшн
```bash
npm run build
npm run start:prod
```

## Тестирование

### Юнит-тесты
```bash
npm run test
```

### Покрытие тестами
```bash
npm run test:cov
```

## Документация API

После запуска приложения Swagger-документация будет доступна по адресу:
```
http://localhost:3000/api
```

## Структура проекта

- **`src/auth`**: Модуль для управления пользователями и авторизацией.
- **`src/mail`**: Модуль для отправки email-уведомлений.
- **`src/status`**: Модуль для мониторинга состояния сервера.
- **`src/utils`**: Утилиты и вспомогательные функции.
