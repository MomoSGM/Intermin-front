import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur : avant chaque requête, lit le token dans localStorage
// et l'injecte automatiquement dans le header Authorization
// → on n'a jamais besoin de l'ajouter manuellement dans les pages
api.interceptors.request.use(config => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    const { token } = JSON.parse(raw);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
