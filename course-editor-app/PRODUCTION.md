# Production Build

## Быстрый старт

### Разработка
```bash
# Из корневой директории проекта
npm run start:dev      # Терминал 1: NestJS (порт 3000)
npm run start:editor   # Терминал 2: React (порт 3001)
```

### Продакшен

```bash
# Сборка всего проекта (бэкенд + редактор)
npm run build

# Запуск
NODE_ENV=production npm run start:prod
```

## Как это работает

### Development
- NestJS: `http://localhost:3000`
- React: `http://localhost:3001`
- Переход на `/course-editor` → редирект на порт 3001

### Production
- Все на одном порту: `http://localhost:3000`
- React собирается в `dist/course-editor/public/`
- NestJS отдает статические файлы
- API доступен на `/course-editor/api/*`

## Структура после сборки

```
dist/
└── course-editor/
    └── public/
        ├── index.html
        └── assets/
            ├── index-[hash].js
            └── index-[hash].css
```

## Деплой

См. подробную инструкцию: [DEPLOY_COURSE_EDITOR.md](../DEPLOY_COURSE_EDITOR.md)
