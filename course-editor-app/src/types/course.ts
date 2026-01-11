export interface ContentBlock {
  type: 'md' | 'image' | 'card' | 'video';
  content?: string;
  url?: string;
  caption?: string;
  cardId?: string;
  deckId?: string;
}

export interface CoursePage {
  title: string;
  blocks: ContentBlock[];
}

export interface CourseChapter {
  title: string;
  pages: CoursePage[];
}

export interface CourseTranslation {
  title: string;
  description: string;
  chapters: CourseChapter[];
}

export interface Course {
  slug: string;
  coverImageUrl?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isPublished: boolean;
  translations: {
    ru: CourseTranslation;
    en: CourseTranslation;
  };
}
