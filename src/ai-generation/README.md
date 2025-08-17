# AI Generation Module

Объединенный модуль для генерации контента через различные AI провайдеры (DeepSeek и Google Gemini).

## Настройка провайдера по умолчанию

Для изменения провайдера по умолчанию отредактируйте файл `src/ai-generation/constants.ts`:

```typescript
// Изменить на нужный провайдер
export const DEFAULT_AI_PROVIDER = AI_PROVIDER.DEEPSEEK; // или AI_PROVIDER.GOOGLE
```

## Использование

### 1. Через API endpoint

```bash
POST /generate
```

#### Пример запроса с DeepSeek (по умолчанию):
```json
{
  "prompt": "Вопрос пользователя: Как мне улучшить финансовую ситуацию?",
  "temperature": 0.7,
  "maxTokens": 800,
  "responseLang": "ru"
}
```

#### Пример запроса с указанием Google Gemini:
```json
{
  "prompt": "Вопрос пользователя: Как мне улучшить финансовую ситуацию?",
  "provider": "google",
  "geminiModel": "gemini-2.0-flash-exp",
  "temperature": 0.7,
  "maxTokens": 800,
  "responseLang": "ru"
}
```

### 2. Программное использование

```typescript
import { AiGenerationService } from './ai-generation/ai-generation.service';
import { AI_PROVIDER } from './ai-generation/constants';

// Инъекция сервиса
constructor(private readonly aiGenerationService: AiGenerationService) {}

// Использование с провайдером по умолчанию
const result = await this.aiGenerationService.generate({
  prompt: "Ваш промт здесь"
});

// Использование с конкретным провайдером
const result = await this.aiGenerationService.generate({
  prompt: "Ваш промт здесь",
  provider: AI_PROVIDER.GOOGLE
});
```

## Поддерживаемые параметры

- `prompt` - основной текст для генерации (обязательный)
- `provider` - AI провайдер (`deepseek` или `google`)
- `systemPrompt` - системный промт (необязательный)
- `temperature` - температура генерации (0.0-2.0)
- `maxTokens` - максимальное количество токенов
- `geminiModel` - модель для Google Gemini
- `deepseekModel` - модель для DeepSeek
- `zodiacSign` - знак зодиака для таро
- `horoscopeDate` - дата для гороскопа
- `responseLang` - язык ответа

## Переменные окружения

Убедитесь, что в `.env` файле настроены API ключи:

```env
DEEPSEEKAPI=your_deepseek_api_key
GOOGLEAPI=your_google_api_key
```

## Обратная совместимость

Старые эндпоинты `/deepseek/generate` и `/google/generate` продолжают работать, но рекомендуется использовать новый объединенный эндпоинт `/generate`.
