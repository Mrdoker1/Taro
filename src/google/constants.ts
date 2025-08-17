export const MAX_OUTPUT_TOKENS = 1000;

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
export const SYSTEM_PROMPT_EXAMPLE = `Ты эксперт в области астрологии и таро.
Отвечай всегда в формате JSON с полем "message".
Будь креативным и используй метафоры.`;

// Модели Google Gemini
export const GEMINI_MODELS = {
  FLASH_2_0: 'gemini-2.0-flash-exp',
  FLASH_1_5: 'gemini-1.5-flash',
  PRO_1_5: 'gemini-1.5-pro',
} as const;

// Модель по умолчанию
export const DEFAULT_MODEL = GEMINI_MODELS.FLASH_2_0;
