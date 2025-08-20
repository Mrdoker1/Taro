export const MAX_OUTPUT_TOKENS = 1000;

// Доступные модели DeepSeek (от самой быстрой к самой мощной)
export const DEEPSEEK_MODELS = {
  CHAT: 'deepseek-chat', // DeepSeek-V3 - самая быстрая и универсальная
  CODER: 'deepseek-coder', // Специализированная для кода
  REASONER: 'deepseek-reasoner', // Для сложных рассуждений (медленнее)
} as const;

// По умолчанию используем самую быструю модель
export const DEFAULT_MODEL = DEEPSEEK_MODELS.CHAT;

// Системный промт для ограничения контекста и формата ответа
export const SYSTEM_PROMPT = `Ты - помощник для генерации текста.
Твоя задача - отвечать на вопросы пользователей в максимально информативной форме.

ВАЖНЫЕ ПРАВИЛА:
1. Ответ ВСЕГДА должен быть в формате JSON с полем "message" для основного сообщения.
2. Длина ответа НЕ должна превышать ${MAX_OUTPUT_TOKENS} токенов.
3. Не используй markdown или другие форматы в тексте ответа.

Пример корректного ответа:
{
  "message": "Твой развернутый ответ"
}`;

// Описание системного промта для отображения в Swagger
export const SYSTEM_PROMPT_DESCRIPTION = 'Системная инструкция для модели.';

// Пример системного промта для отображения в Swagger
export const SYSTEM_PROMPT_EXAMPLE =
  'Ты - помощник для генерации текста. Отвечай на вопросы пользователей в максимально информативной форме.';

// Примеры запросов для Swagger
export const REQUEST_EXAMPLES = {
  general: 'Расскажи о преимуществах микросервисной архитектуры',
  coding: 'Напиши пример REST API на Node.js',
  explanation: 'Как работает алгоритм быстрой сортировки?',
};

// Экспортируем знаки зодиака для использования в других модулях
export const ZODIAC_SIGNS = {
  ARIES: 'Овен',
  TAURUS: 'Телец',
  GEMINI: 'Близнецы',
  CANCER: 'Рак',
  LEO: 'Лев',
  VIRGO: 'Дева',
  LIBRA: 'Весы',
  SCORPIO: 'Скорпион',
  SAGITTARIUS: 'Стрелец',
  CAPRICORN: 'Козерог',
  AQUARIUS: 'Водолей',
  PISCES: 'Рыбы',
};
