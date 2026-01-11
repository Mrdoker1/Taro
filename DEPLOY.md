# 🚀 Запуск и Деплой Course Editor

## Разработка (Development)

### Быстрый старт - одна команда

```bash
npm start
```

Эта команда запустит параллельно:
- 🔷 **API** (NestJS) на `http://localhost:3000`
- 🔶 **EDITOR** (React) на `http://localhost:3001`

### Альтернативный запуск (два терминала)

```bash
# Терминал 1: NestJS бэкенд
npm run start:dev

# Терминал 2: React редактор
npm run start:editor
```

## Продакшен (Production)

### Сборка

```bash
# Собрать все (бэкенд + редактор)
npm run build

# Или по отдельности:
npm run build:backend  # Только NestJS
npm run build:editor   # Только React
```

### Запуск

```bash
NODE_ENV=production npm run start:prod
```

В продакшене все работает на одном порту (3000):
- Редактор: `http://localhost:3000/course-editor`
- API: `http://localhost:3000/course-editor/api/*`

## Структура после сборки

```
dist/
├── main.js                          # NestJS
├── course-editor/
│   └── public/                      # React приложение
│       ├── index.html
│       └── assets/
│           ├── index-[hash].js
│           └── index-[hash].css
└── ... (другие модули)
```

## Деплой на сервер

### 1. Сборка локально

```bash
npm run build
```

### 2. Копирование на сервер

```bash
scp -r dist/ node_modules/ package.json user@server:/var/www/taro/
```

### 3. Запуск на сервере

```bash
ssh user@server
cd /var/www/taro
NODE_ENV=production pm2 restart taro-app
```

## PM2 конфигурация

Создайте `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'taro-app',
    script: 'dist/main.js',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Запуск:

```bash
pm2 start ecosystem.config.js
pm2 save
```

## Проверка

После деплоя:

1. **API работает:**
   ```bash
   curl http://your-domain.com/api
   ```

2. **Редактор доступен:**
   - Откройте `http://your-domain.com/course-editor`
   - Должна загрузиться страница логина

3. **Логин:**
   - Username: `admin`
   - Password: `tarot2024`

## Troubleshooting

### Редактор не загружается

```bash
# Проверьте файлы
ls -la dist/course-editor/public/

# Должны быть: index.html и assets/
```

### API не работает

```bash
# Проверьте логи
pm2 logs taro-app

# Проверьте переменную окружения
echo $NODE_ENV  # Должно быть 'production'
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск разработки (API + Editor) |
| `npm run start:dev` | Только API |
| `npm run start:editor` | Только Editor |
| `npm run build` | Сборка всего |
| `npm run build:backend` | Сборка API |
| `npm run build:editor` | Сборка Editor |
| `npm run start:prod` | Запуск продакшена |

Готово! 🎉
