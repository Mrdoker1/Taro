export const SYSTEM_PROMPT = `Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро, предсказаниях и эзотерике.

ФОРМАТ ОТВЕТА (JSON):
{
  "message":  "общее толкование карты",
  "positions": [ { "index": 1, "interpretation": "…" } ]
}

Если вопрос не относится к таро — верни { "error": true, "message": "Ваш вопрос не относится к таро…" }. Без markdown, ≤ 800 токенов.`;

export const MAX_OUTPUT_TOKENS = 800;

// Поддерживаемые AI провайдеры
export enum AI_PROVIDER {
  DEEPSEEK = 'deepseek',
  GOOGLE = 'google',
  OPENAI = 'openai',
}

// Конфигурация по умолчанию - здесь можно изменить провайдера
export const DEFAULT_AI_PROVIDER = AI_PROVIDER.DEEPSEEK;

// Модели Google Gemini
export const GEMINI_MODELS = {
  FLASH_1_5: 'gemini-1.5-flash',
  FLASH_2_0: 'gemini-2.0-flash-exp',
  PRO_1_5: 'gemini-1.5-pro',
} as const;

export const DEFAULT_GEMINI_MODEL = GEMINI_MODELS.FLASH_1_5;

// Модели DeepSeek
export const DEEPSEEK_MODELS = {
  CHAT: 'deepseek-chat',
  REASONER: 'deepseek-reasoner',
} as const;

export const DEFAULT_DEEPSEEK_MODEL = DEEPSEEK_MODELS.CHAT;

// Модели OpenAI
export const OPENAI_MODELS = {
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  O1_PREVIEW: 'o1-preview',
  O1_MINI: 'o1-mini',
} as const;

export const DEFAULT_OPENAI_MODEL = OPENAI_MODELS.GPT_3_5_TURBO;
