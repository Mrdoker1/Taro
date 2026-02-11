import { Course } from '../schemas/course.schema';

export const vasaCourse: Partial<Course> = {
  "slug": "vasa",
  "coverImageUrl": "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop",
  "level": "beginner",
  "price": 0,
  "isPublished": true,
  "translations": {
    "ru": {
      "title": "Новый курс",
      "description": "Описание курса",
      "chapters": []
    },
    "en": {
      "title": "New Course",
      "description": "Course description",
      "chapters": []
    }
  }
};
