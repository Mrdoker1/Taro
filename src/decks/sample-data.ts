/**
 * Образец данных для колоды Таро
 * Можно использовать для заполнения базы данных начальными данными
 */
export const SAMPLE_DECKS = [
  {
    key: 'rider',
    available: true,
    coverImageUrl: 'https://example.com/images/rider/cover.png',
    translations: {
      ru: {
        name: 'Таро Райдера–Уэйта',
        description: 'Классическая колода Уэйта, выпущена в 1909 году',
      },
      en: {
        name: 'Rider–Waite Tarot',
        description: 'Classic Waite deck, published in 1909',
      },
    },
    cards: [
      {
        id: 'the-fool',
        imageUrl: 'https://example.com/images/rider/cards/the-fool.png',
        translations: {
          ru: {
            name: 'Шут',
            meaning: {
              upright: 'Новые начинания, спонтанность',
              reversed: 'Безрассудство, задержки',
            },
          },
          en: {
            name: 'The Fool',
            meaning: {
              upright: 'New beginnings, spontaneity',
              reversed: 'Recklessness, delays',
            },
          },
        },
      },
      {
        id: 'the-magician',
        imageUrl: 'https://example.com/images/rider/cards/the-magician.png',
        translations: {
          ru: {
            name: 'Маг',
            meaning: {
              upright: 'Сила, концентрация',
              reversed: 'Манипуляции, потеря фокуса',
            },
          },
          en: {
            name: 'The Magician',
            meaning: {
              upright: 'Power, skill',
              reversed: 'Manipulation, scattered energy',
            },
          },
        },
      },
    ],
  },
  {
    key: 'thoth',
    available: true,
    coverImageUrl: 'https://example.com/images/thoth/cover.png',
    translations: {
      ru: {
        name: 'Таро Тота (Кроули)',
        description: 'Оккультная колода Алистера Кроули',
      },
      en: {
        name: 'Thoth Tarot',
        description: "Aleister Crowley's occult deck",
      },
    },
    cards: [
      {
        id: 'the-fool',
        imageUrl: 'https://example.com/images/thoth/cards/the-fool.png',
        translations: {
          ru: {
            name: 'Шут (Тота)',
            meaning: {
              upright: 'Начало пути, свобода',
              reversed: 'Безрассудство, риск',
            },
          },
          en: {
            name: 'The Fool',
            meaning: {
              upright: "Journey's start, freedom",
              reversed: 'Recklessness, folly',
            },
          },
        },
      },
      {
        id: 'the-magician',
        imageUrl: 'https://example.com/images/thoth/cards/the-magician.png',
        translations: {
          ru: {
            name: 'Маг Тота',
            meaning: {
              upright: 'Воля, трансформация',
              reversed: 'Злоупотребление силой',
            },
          },
          en: {
            name: 'The Magician',
            meaning: {
              upright: 'Will, transformation',
              reversed: 'Abuse of power',
            },
          },
        },
      },
    ],
  },
];
