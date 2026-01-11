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
