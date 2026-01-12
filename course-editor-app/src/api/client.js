import axios from 'axios';

const api = axios.create({
  baseURL: '/course-editor/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('editor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('editor-token');
      window.location.href = '/course-editor';
    }
    return Promise.reject(error);
  }
);

export const courseApi = {
  // Auth
  login: async (username, password) => {
    const response = await axios.post('/course-editor/login', { username, password });
    return response.data;
  },

  // Courses
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourse: async (slug) => {
    const response = await api.get(`/courses/${slug}`);
    return response.data;
  },

  getCourseRaw: async (slug) => {
    const response = await api.get(`/courses/${slug}/raw`);
    return response.data;
  },

  saveCourse: async (slug, data) => {
    const response = await api.put(`/courses/${slug}`, { data });
    return response.data;
  },

  saveCourseRaw: async (slug, content) => {
    const response = await api.put(`/courses/${slug}/raw`, { content });
    return response.data;
  },

  createCourse: async (slug) => {
    const response = await api.post('/courses', { slug });
    return response.data;
  },

  deleteCourse: async (slug) => {
    const response = await api.delete(`/courses/${slug}`);
    return response.data;
  },
};

// Создаем отдельный API клиент для промпт-шаблонов (без auth)
const promptApi = axios.create({
  baseURL: '/prompt-template',
});

export const promptTemplatesApi = {
  // Get all templates
  getAllTemplates: async () => {
    const response = await promptApi.get('/');
    return response.data;
  },

  // Get template by ID
  getTemplate: async (key) => {
    const response = await promptApi.get(`/${key}`);
    return response.data;
  },

  // Create template
  createTemplate: async (data) => {
    const response = await promptApi.post('/', data);
    return response.data;
  },

  // Update template
  updateTemplate: async (key, data) => {
    const response = await promptApi.put(`/${key}`, data);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (key) => {
    const response = await promptApi.delete(`/${key}`);
    return response.data;
  },
};

// API для раскладов
const spreadsApiClient = axios.create({
  baseURL: '/spreads',
});

export const spreadsApi = {
  // Get all spreads (summary)
  getAllSpreads: async () => {
    const response = await spreadsApiClient.get('/?lang=ru');
    return response.data;
  },

  // Get spread by ID (raw data for editing)
  getSpreadRaw: async (key) => {
    const response = await spreadsApiClient.get(`/${key}/raw`);
    return response.data;
  },

  // Create spread
  createSpread: async (data) => {
    const response = await spreadsApiClient.post('/', data);
    return response.data;
  },

  // Update spread
  updateSpread: async (key, data) => {
    const response = await spreadsApiClient.put(`/${key}`, data);
    return response.data;
  },

  // Delete spread
  deleteSpread: async (key) => {
    const response = await spreadsApiClient.delete(`/${key}`);
    return response.data;
  },
};

// Decks API client
const decksApiClient = axios.create({
  baseURL: '/decks',
});

// Add auth token to decks requests
decksApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('editor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Decks API
export const decksApi = {
  // Get all decks
  getAllDecks: async () => {
    const response = await decksApiClient.get('?lang=ru');
    return response.data;
  },
  
  // Get deck raw data
  getDeckRaw: async (key) => {
    const response = await decksApiClient.get(`/${key}/raw`);
    return response.data;
  },
  
  // Create deck
  createDeck: async (deckData) => {
    const response = await decksApiClient.post('/', deckData);
    return response.data;
  },
  
  // Update deck
  updateDeck: async (key, deckData) => {
    const response = await decksApiClient.put(`/${key}`, deckData);
    return response.data;
  },
  
  // Delete deck
  deleteDeck: async (key) => {
    const response = await decksApiClient.delete(`/${key}`);
    return response.data;
  },
};

// Users API Client
const usersApiClient = axios.create({
  baseURL: '/auth',
});

usersApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('editor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
usersApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('editor-token');
      window.location.href = '/course-editor';
    }
    return Promise.reject(error);
  }
);

export const usersApi = {
  // Get all users
  getAllUsers: async (appType) => {
    const params = appType ? { appType } : {};
    const response = await usersApiClient.get('/users', { params });
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await usersApiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await usersApiClient.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await usersApiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Send confirmation email
  sendConfirmationEmail: async (userId) => {
    const response = await usersApiClient.post(`/users/${userId}/send-confirmation`);
    return response.data;
  },

  // Send password reset email
  sendPasswordResetEmail: async (userId) => {
    const response = await usersApiClient.post(`/users/${userId}/send-password-reset`);
    return response.data;
  },
};
