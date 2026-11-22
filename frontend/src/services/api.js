import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Will be proxied to http://localhost:8080/api via Vite
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token here when authentication is implemented
    // const token = localStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          console.error('Validation Error:', data?.details || data?.message);
          break;
        case 404:
          console.error('Not Found:', data?.message);
          break;
        case 409:
          console.error('Conflict:', data?.message);
          break;
        case 500:
          console.error('Server Error:', data?.message);
          break;
      }
    } else if (error.request) {
      console.error('Network Error: Unable to connect to server');
    }
    return Promise.reject(error);
  }
);

// API functions for tutors
export const tutorApi = {
  /**
   * Register a new tutor
   */
  register: async (tutorData) => {
    const response = await api.post('/tutors', tutorData);
    return response.data;
  },

  /**
   * Search tutors by location and optional filters
   */
  search: async (params) => {
    const searchParams = new URLSearchParams();
    searchParams.append('location', params.location);
    if (params.subject && params.subject !== 'All') {
      searchParams.append('subject', params.subject);
    }
    if (params.minRating) {
      searchParams.append('minRating', params.minRating.toString());
    }
    if (params.availability) {
      searchParams.append('availability', params.availability);
    }

    const response = await api.get(`/tutors?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Get all tutors
   */
  getAll: async () => {
    const response = await api.get('/tutors/all');
    return response.data;
  },

  /**
   * Get tutor by ID
   */
  getById: async (id) => {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },

  /**
   * Delete tutor by ID
   */
  delete: async (id) => {
    const response = await api.delete(`/tutors/${id}`);
    return response.data;
  },

  /**
   * Health check
   */
  health: async () => {
    const response = await api.get('/tutors/health');
    return response.data;
  },
};

export default api;