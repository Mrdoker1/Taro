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
  GROK = 'grok',
  QWEN = 'qwen',
}

// Конфигурация по умолчанию - здесь можно изменить провайдера
export const DEFAULT_AI_PROVIDER = AI_PROVIDER.QWEN;

// Модели Google Gemini
export const GEMINI_MODELS = {
  FLASH_1_5: 'gemini-1.5-flash',
  FLASH_2_0: 'gemini-2.0-flash-exp',
  FLASH_2_5_LITE: 'gemini-2.5-flash-lite',
  PRO_1_5: 'gemini-1.5-pro',
} as const;

export const DEFAULT_GEMINI_MODEL = GEMINI_MODELS.FLASH_2_5_LITE;

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

// Модели Grok (xAI)
export const GROK_MODELS = {
  // Grok 4 (новейшая модель с рассуждениями)
  GROK_4: 'grok-4',
  GROK_4_0709: 'grok-4-0709',
  GROK_4_LATEST: 'grok-4-latest',

  // Grok 3 (предыдущие версии)
  GROK_3: 'grok-3',
  GROK_3_MINI: 'grok-3-mini',
  GROK_3_MINI_FAST: 'grok-3-mini-fast',
  GROK_3_LATEST: 'grok-3-latest',

  // Grok 2 (старые версии)
  GROK_2_LATEST: 'grok-2-latest',
  GROK_2_1212: 'grok-2-1212',
} as const;

export const DEFAULT_GROK_MODEL = GROK_MODELS.GROK_3_MINI;

// Модели Qwen
export const QWEN_MODELS = {
  QWEN_PLUS: 'qwen-plus',
  QWEN_TURBO: 'qwen-turbo',
  QWEN_MAX: 'qwen-max',
  QWEN_LONG: 'qwen-long',
  QWEN2_5_72B_INSTRUCT: 'qwen2.5-72b-instruct',
  QWEN2_5_32B_INSTRUCT: 'qwen2.5-32b-instruct',
  QWEN2_5_14B_INSTRUCT: 'qwen2.5-14b-instruct',
  QWEN2_5_7B_INSTRUCT: 'qwen2.5-7b-instruct',
} as const;

export const DEFAULT_QWEN_MODEL = QWEN_MODELS.QWEN_PLUS;
