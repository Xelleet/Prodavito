// src/services/api.js
import axios from 'axios';

// Базовый URL вашего Django backend
const API_BASE_URL = 'http://localhost:8000'; // Замените на ваш URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Важно для сессий Django
});

export default api;