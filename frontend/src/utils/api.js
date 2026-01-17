import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  getProfile: () => api.get('/auth/profile')
};

// Games API
export const gamesAPI = {
  play: (gameType, betAmount) =>
    api.post('/games/play', { gameType, betAmount }),
  getConfig: (gameType) =>
    api.get(`/games/config/${gameType}`)
};

// Balance API
export const balanceAPI = {
  getBalance: () => api.get('/balance/balance'),
  getTransactions: (limit = 50, offset = 0) =>
    api.get('/balance/transactions', { params: { limit, offset } }),
  getGameHistory: (limit = 100, offset = 0) =>
    api.get('/balance/game-history', { params: { limit, offset } })
};

export default api;
