import { Course } from '../schemas/course.schema';

export const basicTarotCourse: Partial<Course> = {
  "slug": "basic-tarot",
  "coverImageUrl": "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m01.jpg",
  "level": "beginner",
  "price": 10,
  "isPublished": true,
  "translations": {
    "ru": {
      "title": "Базовый курс Таро GAY",
      "description": "Изучите основы Таро с нуля: структура колоды, чтение символов, Старшие Арканы, база Младших Арканов и простые расклады.",
      "chapters": [
        {
          "title": "Старт",
          "pages": [
            {
              "title": "Что такое Таро и как учиться",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Что такое Таро и как учиться\n\nТаро — это **язык символов**. В этом курсе мы используем карты как инструмент для размышления, выбора и самопознания.\n\n## Как устроен курс\n- Короткие главы: одна тема — один шаг.\n- В каждой странице: смысл, вопросы и мини‑практика.\n- Картинки встроены прямо в Markdown (как `![alt](url)`).\n\n## Мини‑настройка\nПеред началом:\n1) Выбери спокойное место на 10 минут.  \n2) Отключи уведомления.  \n3) Сформулируй один вопрос: «Что мне важно понять сейчас?».\n"
                }
              ],
              "_id": "page-1768245595898-0"
            },
            {
              "title": "Правила чтения (база)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Правила чтения (база)\n\n## 1) Сначала смотрим на картинку\nЧто бросается в глаза? Цвета, поза, предметы, направление взгляда.\n\n## 2) Потом — смысл\nИспользуй ключевые слова, но не «впихивай» значение.\n\n## 3) Контекст важнее таблиц\nОдна и та же карта про разные вещи в зависимости от вопроса.\n\n## 4) Перевёрнутые карты\nВ этом курсе «перевёрнутое» — это:\n- блок / задержка,\n- теневая сторона,\n- внутренний процесс,\n- искажение темы.\n\n## Быстрый чек‑лист\n- Что здесь про **меня**?\n- Что здесь про **ситуацию**?\n- Что здесь про **следующий шаг**?\n"
                }
              ],
              "_id": "page-1768245595898-1"
            },
            {
              "title": "Структура колоды",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Структура колоды\n\nКолода классического Таро — **78 карт**:\n\n## Старшие Арканы (22)\nБольшие темы: этапы пути, архетипы, поворотные моменты.\n\n## Младшие Арканы (56)\nПовседневные сюжеты. 4 масти:\n- **Жезлы** — энергия, действие, вдохновение  \n- **Кубки** — чувства, отношения, эмпатия  \n- **Мечи** — мысли, решения, конфликты  \n- **Пентакли** — деньги, тело, быт, ресурсы  \n\nНиже — примеры «тузов» как вход в масть:\n\n- Жезлы: ![Туз Жезлов](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg)  \n- Кубки: ![Туз Кубков](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg)  \n- Мечи: ![Туз Мечей](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg)  \n- Пентакли: ![Туз Пентаклей](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg)  \n"
                }
              ],
              "_id": "page-1768245595898-2"
            }
          ],
          "_id": "chapter-1768245595891-0"
        },
        {
          "title": "Старшие Арканы",
          "pages": [
            {
              "title": "0. Шут",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 0. Шут (The Fool)\n\n![Шут](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m00.jpg)\n\n**Ключевые темы (прямое):** Начало пути, доверие жизни, спонтанность.  \n**Ключевые темы (перевёрнутое):** Безрассудство, страх нового, хаос.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-0"
            },
            {
              "title": "1. Маг",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 1. Маг (The Magician)\n\n![Маг](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m01.jpg)\n\n**Ключевые темы (прямое):** Воля, мастерство, ресурсность, проявление.  \n**Ключевые темы (перевёрнутое):** Манипуляции, распыление, неуверенность.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-1"
            },
            {
              "title": "2. Верховная Жрица",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 2. Верховная Жрица (The High Priestess)\n\n![Верховная Жрица](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m02.jpg)\n\n**Ключевые темы (прямое):** Интуиция, тайное знание, глубина.  \n**Ключевые темы (перевёрнутое):** Закрытость, самообман, игнорирование внутреннего голоса.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-2"
            },
            {
              "title": "3. Императрица",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 3. Императрица (The Empress)\n\n![Императрица](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m03.jpg)\n\n**Ключевые темы (прямое):** Изобилие, забота, творчество, рост.  \n**Ключевые темы (перевёрнутое):** Застой, гиперопека, потеря ресурса.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-3"
            },
            {
              "title": "4. Император",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 4. Император (The Emperor)\n\n![Император](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m04.jpg)\n\n**Ключевые темы (прямое):** Структура, ответственность, границы, власть.  \n**Ключевые темы (перевёрнутое):** Жесткость, контроль, упрямство.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-4"
            },
            {
              "title": "5. Иерофант",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 5. Иерофант (The Hierophant)\n\n![Иерофант](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m05.jpg)\n\n**Ключевые темы (прямое):** Традиции, обучение, наставник, ценности.  \n**Ключевые темы (перевёрнутое):** Догматизм, бунт против правил, поверхностная вера.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-5"
            },
            {
              "title": "6. Влюблённые",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 6. Влюблённые (The Lovers)\n\n![Влюблённые](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m06.jpg)\n\n**Ключевые темы (прямое):** Выбор, союз, ценности сердца.  \n**Ключевые темы (перевёрнутое):** Колебания, зависимость, несогласованность.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-6"
            },
            {
              "title": "7. Колесница",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 7. Колесница (The Chariot)\n\n![Колесница](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m07.jpg)\n\n**Ключевые темы (прямое):** Движение, дисциплина, победа, курс.  \n**Ключевые темы (перевёрнутое):** Потеря контроля, спешка, конфликт целей.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-7"
            },
            {
              "title": "8. Сила",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 8. Сила (Strength)\n\n![Сила](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m08.jpg)\n\n**Ключевые темы (прямое):** Мужество, мягкая сила, приручение импульсов.  \n**Ключевые темы (перевёрнутое):** Слабость, вспыльчивость, подавление чувств.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-8"
            },
            {
              "title": "9. Отшельник",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 9. Отшельник (The Hermit)\n\n![Отшельник](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m09.jpg)\n\n**Ключевые темы (прямое):** Самопознание, пауза, мудрость.  \n**Ключевые темы (перевёрнутое):** Изоляция, закрытость, страх контакта.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-9"
            },
            {
              "title": "10. Колесо Фортуны",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 10. Колесо Фортуны (Wheel of Fortune)\n\n![Колесо Фортуны](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m10.jpg)\n\n**Ключевые темы (прямое):** Перемены, циклы, шанс, судьба.  \n**Ключевые темы (перевёрнутое):** Сопротивление переменам, повтор сценариев.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-10"
            },
            {
              "title": "11. Справедливость",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 11. Справедливость (Justice)\n\n![Справедливость](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m11.jpg)\n\n**Ключевые темы (прямое):** Баланс, честность, ответственность.  \n**Ключевые темы (перевёрнутое):** Несправедливость, самооправдание, перекос.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-11"
            },
            {
              "title": "12. Повешенный",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 12. Повешенный (The Hanged Man)\n\n![Повешенный](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m12.jpg)\n\n**Ключевые темы (прямое):** Переоценка, пауза, новый взгляд.  \n**Ключевые темы (перевёрнутое):** Застревание, жертвенность, прокрастинация.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-12"
            },
            {
              "title": "13. Смерть",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 13. Смерть (Death)\n\n![Смерть](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m13.jpg)\n\n**Ключевые темы (прямое):** Завершение, трансформация, обновление.  \n**Ключевые темы (перевёрнутое):** Страх потерь, удерживание прошлого.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-13"
            },
            {
              "title": "14. Умеренность",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 14. Умеренность (Temperance)\n\n![Умеренность](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m14.jpg)\n\n**Ключевые темы (прямое):** Гармония, смешение, исцеление.  \n**Ключевые темы (перевёрнутое):** Крайности, разлад, нетерпение.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-14"
            },
            {
              "title": "15. Дьявол",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 15. Дьявол (The Devil)\n\n![Дьявол](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m15.jpg)\n\n**Ключевые темы (прямое):** Привязки, искушения, тень, зависимости.  \n**Ключевые темы (перевёрнутое):** Освобождение, осознание, выход из цепей.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-15"
            },
            {
              "title": "16. Башня",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 16. Башня (The Tower)\n\n![Башня](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m16.jpg)\n\n**Ключевые темы (прямое):** Прорыв, разрушение иллюзий, правда.  \n**Ключевые темы (перевёрнутое):** Страх перемен, избегание неизбежного.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-16"
            },
            {
              "title": "17. Звезда",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 17. Звезда (Звезда)\n\n![Звезда](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m17.jpg)\n\n**Ключевые темы (прямое):** Надежда, вдохновение, восстановление.  \n**Ключевые темы (перевёрнутое):** Разочарование, утрата веры, пессимизм.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-17"
            },
            {
              "title": "18. Луна",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 18. Луна (Луна)\n\n![Луна](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m18.jpg)\n\n**Ключевые темы (прямое):** Подсознание, сны, туман, интуиция.  \n**Ключевые темы (перевёрнутое):** Иллюзии, тревога, самообман.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-18"
            },
            {
              "title": "19. Солнце",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 19. Солнце (Солнце)\n\n![Солнце](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg)\n\n**Ключевые темы (прямое):** Радость, ясность, успех, тепло.  \n**Ключевые темы (перевёрнутое):** Эго, выгорание, завышенные ожидания.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-19"
            },
            {
              "title": "20. Суд",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 20. Суд (Judgement)\n\n![Суд](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m20.jpg)\n\n**Ключевые темы (прямое):** Пробуждение, призвание, пересмотр.  \n**Ключевые темы (перевёрнутое):** Самокритика, страх оценки, застревание в прошлом.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-20"
            },
            {
              "title": "21. Мир",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 21. Мир (The World)\n\n![Мир](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m21.jpg)\n\n**Ключевые темы (прямое):** Завершение цикла, интеграция, результат.  \n**Ключевые темы (перевёрнутое):** Незавершенность, распыление, страх финала.\n\n## Вопросы для размышления\n- Где в моей жизни сейчас проявляется тема этой карты?\n- Что я могу сделать *сегодня*, чтобы прожить её «прямое» значение экологично?\n- Если карта «перевёрнута» — что я избегаю видеть или признавать?\n\n## Мини‑практика (2 минуты)\nЗапиши 3 слова‑ассоциации к карте, затем 1 маленький шаг на ближайшие 24 часа.\n"
                }
              ],
              "_id": "page-1768245595913-21"
            }
          ],
          "_id": "chapter-1768245595891-1"
        },
        {
          "title": "Младшие Арканы: обзор",
          "pages": [
            {
              "title": "Жезлы: энергия и действие",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Жезлы: энергия и действие\n\nЖезлы — про **огонь**: мотивация, смелость, движение, инициативу.\n\n![Туз Жезлов](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg)\n\n## Вопросы масти\n- Что меня зажигает?\n- Где мне нужно действовать?\n- Где я перегорел(а)?\n\n## Когда «перевёрнуто»\n- распыление,\n- прокрастинация,\n- выгорание.\n"
                }
              ],
              "_id": "page-1768245595992-0"
            },
            {
              "title": "Кубки: чувства и связь",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Кубки: чувства и связь\n\nКубки — про **воду**: эмоции, любовь, принятие, контакт с собой.\n\n![Туз Кубков](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg)\n\n## Вопросы масти\n- Что я чувствую *на самом деле*?\n- Где мне нужна близость?\n- Что я избегаю проживать?\n\n## Когда «перевёрнуто»\n- эмоциональная закрытость,\n- зависимость,\n- иллюзии в отношениях.\n"
                }
              ],
              "_id": "page-1768245595992-1"
            },
            {
              "title": "Мечи: мысль и решение",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Мечи: мысль и решение\n\nМечи — про **воздух**: мышление, конфликт, ясность, выбор.\n\n![Туз Мечей](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg)\n\n## Вопросы масти\n- Какие факты я игнорирую?\n- Какое решение назрело?\n- Где я сам(а) себя критикую?\n\n## Когда «перевёрнуто»\n- ментальный шум,\n- страх правды,\n- самообман.\n"
                }
              ],
              "_id": "page-1768245595992-2"
            },
            {
              "title": "Пентакли: ресурс и реальность",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Пентакли: ресурс и реальность\n\nПентакли — про **землю**: деньги, тело, стабильность, быт.\n\n![Туз Пентаклей](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg)\n\n## Вопросы масти\n- Что я строю «в долгую»?\n- Как я забочусь о теле?\n- Где мне нужна система/план?\n\n## Когда «перевёрнуто»\n- хаос в финансах,\n- отсутствие режима,\n- страх ответственности.\n"
                }
              ],
              "_id": "page-1768245595992-3"
            }
          ],
          "_id": "chapter-1768245595891-2"
        },
        {
          "title": "Простые расклады",
          "pages": [
            {
              "title": "Расклад на день (1 карта)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Расклад на день (1 карта)\n\n**Вопрос:** «Какая энергия дня и на что обратить внимание?»\n\n## Как делать\n1) Сформулируй вопрос.  \n2) Вытащи 1 карту.  \n3) Ответь письменно:\n- Что вижу на карте?\n- Что это значит *для меня сегодня*?\n- Какой маленький шаг я могу сделать?\n\n## Подсказка\nЕсли карта «тяжёлая» (Башня, Дьявол), это не «плохо», а **про честность** и зоны роста.\n"
                }
              ],
              "_id": "page-1768245596008-0"
            },
            {
              "title": "Прояснение ситуации (3 карты)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Прояснение ситуации (3 карты)\n\n**1. Я/моя позиция**  \n**2. Ситуация/контекст**  \n**3. Лучший следующий шаг**\n\n## Как читать\n- Сначала 3 картинки: общий сюжет?\n- Затем связки: где конфликт/поддержка?\n- В конце — *одно действие*, которое ты реально сделаешь.\n\n## Частая ошибка\nНе пытайся «предсказать судьбу». Сфокусируйся на решении.\n"
                }
              ],
              "_id": "page-1768245596008-1"
            },
            {
              "title": "Отношения (3 карты)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Отношения (3 карты)\n\n**1. Я в отношениях**  \n**2. Другой человек**  \n**3. Между нами (динамика)**\n\n## Памятка\n- Карта **не** заменяет разговор.\n- Таро помогает увидеть: ожидания, страхи, потребности.\n\n## Вопросы\n- Что мне важно проговорить?\n- Где я идеализирую/обесцениваю?\n- Какой шаг улучшит контакт?\n"
                }
              ],
              "_id": "page-1768245596008-2"
            }
          ],
          "_id": "chapter-1768245595891-3"
        },
        {
          "title": "Этика и безопасность",
          "pages": [
            {
              "title": "Этика",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Этика\n\nТаро — не про контроль над другими людьми.\n\n## Рекомендуется\n- спрашивать про **себя** и свои действия;\n- уважать границы: «что *я* могу сделать»;\n- сохранять конфиденциальность.\n\n## Не рекомендуется\n- «что он/она думает обо мне?» как инструмент контроля;\n- медицинские/юридические «диагнозы» по картам;\n- зависимость от раскладов вместо решений.\n\n## Хорошая формулировка\nВместо: «Вернётся ли он?»  \nЛучше: «Как мне поддержать себя и какие шаги дадут лучший результат?»\n"
                }
              ],
              "_id": "page-1768245596020-0"
            }
          ],
          "_id": "chapter-1768245595891-4"
        }
      ]
    },
    "en": {
      "title": "Basic Tarot Course",
      "description": "Learn Tarot from scratch: deck structure, how to read symbols, Major Arcana, a foundation of the Minor Arcana, and simple spreads.",
      "chapters": [
        {
          "title": "Start",
          "pages": [
            {
              "title": "What Tarot is and how to study",
              "blocks": [
                {
                  "type": "md",
                  "content": "# What Tarot is and how to study\n\nTarot is a **language of symbols**. In this course we use cards as a tool for reflection, decision‑making and self‑knowledge.\n\n## Course format\n- Short chapters: one topic — one step.\n- Every page includes meaning, prompts and a mini‑practice.\n- Images are embedded directly in Markdown (`![alt](url)`).\n\n## Quick setup\nBefore you start:\n1) Find a quiet spot for 10 minutes.  \n2) Turn off notifications.  \n3) Form one question: “What do I need to understand right now?”\n"
                }
              ],
              "_id": "page-1768245596027-0"
            },
            {
              "title": "Reading rules (foundation)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Reading rules (foundation)\n\n## 1) Start with the picture\nWhat stands out? Colors, posture, objects, gaze direction.\n\n## 2) Then meaning\nUse keywords, but don’t force‑fit interpretations.\n\n## 3) Context beats tables\nThe same card can mean different things depending on the question.\n\n## 4) Reversals\nIn this course “reversed” may indicate:\n- a block / delay,\n- shadow side,\n- inner process,\n- distortion of the theme.\n\n## Quick checklist\n- What is this about **me**?\n- What is this about the **situation**?\n- What is the **next step**?\n"
                }
              ],
              "_id": "page-1768245596027-1"
            },
            {
              "title": "Deck structure",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Deck structure\n\nA classic Tarot deck has **78 cards**:\n\n## Major Arcana (22)\nBig themes: archetypes, turning points, stages of the journey.\n\n## Minor Arcana (56)\nEveryday stories. 4 suits:\n- **Wands** — energy, action, inspiration  \n- **Cups** — feelings, relationships, empathy  \n- **Swords** — thoughts, decisions, conflict  \n- **Pentacles** — money, body, practical resources  \n\nExamples (Aces as the “entry point”):\n\n- Wands: ![Ace of Wands](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg)  \n- Cups: ![Ace of Cups](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg)  \n- Swords: ![Ace of Swords](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg)  \n- Pentacles: ![Ace of Pentacles](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg)  \n"
                }
              ],
              "_id": "page-1768245596027-2"
            }
          ],
          "_id": "chapter-1768245595891-0"
        },
        {
          "title": "Major Arcana",
          "pages": [
            {
              "title": "0. The Fool",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 0. The Fool\n\n![The Fool](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m00.jpg)\n\n**Upright themes:** New beginnings, trust, spontaneity.  \n**Reversed themes:** Recklessness, fear of the new, chaos.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-0"
            },
            {
              "title": "1. The Magician",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 1. The Magician\n\n![The Magician](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m01.jpg)\n\n**Upright themes:** Willpower, skill, resources, manifestation.  \n**Reversed themes:** Manipulation, scattered energy, insecurity.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-1"
            },
            {
              "title": "2. The High Priestess",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 2. The High Priestess\n\n![The High Priestess](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m02.jpg)\n\n**Upright themes:** Intuition, hidden knowledge, depth.  \n**Reversed themes:** Secrecy, self-deception, ignoring inner voice.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-2"
            },
            {
              "title": "3. The Empress",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 3. The Empress\n\n![The Empress](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m03.jpg)\n\n**Upright themes:** Abundance, nurture, creativity, growth.  \n**Reversed themes:** Stagnation, smothering, depleted energy.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-3"
            },
            {
              "title": "4. The Emperor",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 4. The Emperor\n\n![The Emperor](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m04.jpg)\n\n**Upright themes:** Structure, responsibility, boundaries, authority.  \n**Reversed themes:** Rigidity, control, stubbornness.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-4"
            },
            {
              "title": "5. The Hierophant",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 5. The Hierophant\n\n![The Hierophant](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m05.jpg)\n\n**Upright themes:** Tradition, learning, mentor, values.  \n**Reversed themes:** Dogma, rebellion, shallow belief.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-5"
            },
            {
              "title": "6. The Lovers",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 6. The Lovers\n\n![The Lovers](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m06.jpg)\n\n**Upright themes:** Choice, union, heart-aligned values.  \n**Reversed themes:** Indecision, dependency, misalignment.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-6"
            },
            {
              "title": "7. The Chariot",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 7. The Chariot\n\n![The Chariot](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m07.jpg)\n\n**Upright themes:** Drive, discipline, victory, direction.  \n**Reversed themes:** Loss of control, haste, conflicting goals.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-7"
            },
            {
              "title": "8. Strength",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 8. Strength\n\n![Strength](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m08.jpg)\n\n**Upright themes:** Courage, gentle power, taming impulses.  \n**Reversed themes:** Weakness, reactivity, suppression.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-8"
            },
            {
              "title": "9. The Hermit",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 9. The Hermit\n\n![The Hermit](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m09.jpg)\n\n**Upright themes:** Introspection, pause, wisdom.  \n**Reversed themes:** Isolation, withdrawal, fear of connection.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-9"
            },
            {
              "title": "10. Wheel of Fortune",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 10. Wheel of Fortune\n\n![Wheel of Fortune](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m10.jpg)\n\n**Upright themes:** Change, cycles, luck, fate.  \n**Reversed themes:** Resistance to change, repeating patterns.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-10"
            },
            {
              "title": "11. Justice",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 11. Justice\n\n![Justice](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m11.jpg)\n\n**Upright themes:** Balance, honesty, accountability.  \n**Reversed themes:** Injustice, rationalization, imbalance.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-11"
            },
            {
              "title": "12. The Hanged Man",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 12. The Hanged Man\n\n![The Hanged Man](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m12.jpg)\n\n**Upright themes:** Reframing, pause, new perspective.  \n**Reversed themes:** Stagnation, martyrdom, procrastination.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-12"
            },
            {
              "title": "13. Death",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 13. Death\n\n![Death](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m13.jpg)\n\n**Upright themes:** Endings, transformation, renewal.  \n**Reversed themes:** Fear of loss, clinging to the past.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-13"
            },
            {
              "title": "14. Temperance",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 14. Temperance\n\n![Temperance](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m14.jpg)\n\n**Upright themes:** Harmony, blending, healing.  \n**Reversed themes:** Extremes, discord, impatience.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-14"
            },
            {
              "title": "15. The Devil",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 15. The Devil\n\n![The Devil](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m15.jpg)\n\n**Upright themes:** Attachments, temptation, shadow, addiction.  \n**Reversed themes:** Liberation, awareness, breaking chains.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-15"
            },
            {
              "title": "16. The Tower",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 16. The Tower\n\n![The Tower](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m16.jpg)\n\n**Upright themes:** Breakthrough, collapse of illusions, truth.  \n**Reversed themes:** Fear of change, resisting the inevitable.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-16"
            },
            {
              "title": "17. Звезда",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 17. Звезда\n\n![Звезда](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m17.jpg)\n\n**Upright themes:** Hope, inspiration, renewal.  \n**Reversed themes:** Despair, loss of faith, pessimism.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-17"
            },
            {
              "title": "18. Луна",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 18. Луна\n\n![Луна](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m18.jpg)\n\n**Upright themes:** Subconscious, dreams, uncertainty, intuition.  \n**Reversed themes:** Illusions, anxiety, deception.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-18"
            },
            {
              "title": "19. Солнце",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 19. Солнце\n\n![Солнце](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg)\n\n**Upright themes:** Joy, clarity, success, warmth.  \n**Reversed themes:** Ego, burnout, unrealistic expectations.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-19"
            },
            {
              "title": "20. Judgement",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 20. Judgement\n\n![Judgement](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m20.jpg)\n\n**Upright themes:** Awakening, calling, review.  \n**Reversed themes:** Self-judgment, fear of evaluation, stuck in past.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-20"
            },
            {
              "title": "21. The World",
              "blocks": [
                {
                  "type": "md",
                  "content": "# 21. The World\n\n![The World](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m21.jpg)\n\n**Upright themes:** Completion, integration, achievement.  \n**Reversed themes:** Lack of closure, scattered focus, fear of finishing.\n\n## Reflection prompts\n- Where does this card show up in my life right now?\n- What can I do *today* to embody the upright meaning in a healthy way?\n- If reversed—what am I avoiding or unwilling to acknowledge?\n\n## 2‑minute practice\nWrite 3 associations, then 1 small action for the next 24 hours.\n"
                }
              ],
              "_id": "page-1768245596040-21"
            }
          ],
          "_id": "chapter-1768245595891-1"
        },
        {
          "title": "Minor Arcana: overview",
          "pages": [
            {
              "title": "Wands: energy & action",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Wands: energy & action\n\nWands correspond to **fire**: motivation, courage, movement, initiative.\n\n![Ace of Wands](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg)\n\n## Suit prompts\n- What ignites me?\n- Where do I need to act?\n- Where am I burning out?\n\n## Reversed often points to\n- scattered effort,\n- procrastination,\n- burnout.\n"
                }
              ],
              "_id": "page-1768245596125-0"
            },
            {
              "title": "Cups: feelings & connection",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Cups: feelings & connection\n\nCups correspond to **water**: emotions, love, acceptance, connection.\n\n![Ace of Cups](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg)\n\n## Suit prompts\n- What do I truly feel?\n- Where do I need closeness?\n- What am I avoiding feeling?\n\n## Reversed often points to\n- emotional shutdown,\n- dependency,\n- illusions in relationships.\n"
                }
              ],
              "_id": "page-1768245596125-1"
            },
            {
              "title": "Swords: thought & decisions",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Swords: thought & decisions\n\nSwords correspond to **air**: mind, conflict, clarity, choices.\n\n![Ace of Swords](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg)\n\n## Suit prompts\n- What facts am I ignoring?\n- What decision is due?\n- Where am I harsh on myself?\n\n## Reversed often points to\n- mental noise,\n- fear of truth,\n- self-deception.\n"
                }
              ],
              "_id": "page-1768245596125-2"
            },
            {
              "title": "Pentacles: resources & reality",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Pentacles: resources & reality\n\nPentacles correspond to **earth**: money, body, stability, daily life.\n\n![Ace of Pentacles](https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg)\n\n## Suit prompts\n- What am I building long-term?\n- How do I care for my body?\n- Where do I need a plan?\n\n## Reversed often points to\n- financial chaos,\n- lack of routine,\n- fear of responsibility.\n"
                }
              ],
              "_id": "page-1768245596125-3"
            }
          ],
          "_id": "chapter-1768245595891-2"
        },
        {
          "title": "Simple spreads",
          "pages": [
            {
              "title": "Daily draw (1 card)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Daily draw (1 card)\n\n**Question:** “What’s the energy of the day and what should I focus on?”\n\n## Steps\n1) Ask the question.  \n2) Pull 1 card.  \n3) Write:\n- What do I see?\n- What does it mean *for today*?\n- What small action can I take?\n\n## Note\n“Challenging” cards (Tower, Devil) are not “bad” — they often point to truth and growth.\n"
                }
              ],
              "_id": "page-1768245596150-0"
            },
            {
              "title": "Clarity spread (3 cards)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Clarity spread (3 cards)\n\n**1. Me / my stance**  \n**2. Situation / context**  \n**3. Best next step**\n\n## How to read\n- First: the overall story across images.\n- Then: connections—conflict/support.\n- Finally: choose *one real action*.\n\n## Common pitfall\nDon’t chase “fate”. Focus on decision‑making.\n"
                }
              ],
              "_id": "page-1768245596150-1"
            },
            {
              "title": "Relationships (3 cards)",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Relationships (3 cards)\n\n**1. Me in the relationship**  \n**2. The other person**  \n**3. Between us (dynamic)**\n\n## Reminder\n- Tarot is not a replacement for communication.\n- It helps reveal expectations, fears and needs.\n\n## Prompts\n- What should I communicate?\n- Where do I idealize or devalue?\n- What step improves connection?\n"
                }
              ],
              "_id": "page-1768245596150-2"
            }
          ],
          "_id": "chapter-1768245595891-3"
        },
        {
          "title": "Ethics & safety",
          "pages": [
            {
              "title": "Ethics",
              "blocks": [
                {
                  "type": "md",
                  "content": "# Ethics\n\nTarot is not about controlling other people.\n\n## Recommended\n- ask about **yourself** and your actions;\n- respect boundaries: “what can *I* do?”;\n- keep confidentiality.\n\n## Not recommended\n- using readings as control (“what do they think of me?”);\n- medical/legal “diagnoses” via cards;\n- compulsive readings instead of decisions.\n\n## Better wording\nInstead of: “Will they come back?”  \nTry: “How can I support myself, and what steps lead to the best outcome?”\n"
                }
              ],
              "_id": "page-1768245596162-0"
            }
          ],
          "_id": "chapter-1768245595891-4"
        }
      ]
    }
  }
};
