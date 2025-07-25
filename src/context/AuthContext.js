// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/user/'); // Предполагаемый эндпоинт для получения текущего пользователя
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      // CSRF токен может потребоваться
      const csrfRes = await api.get('/csrf/'); // Эндпоинт для получения CSRF токена
      const csrfToken = csrfRes.data.csrfToken;

      const res = await api.post('/login/', { username, password }, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      setUser(res.data.user); // Предполагаем, что бэкенд возвращает пользователя
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: err.response?.data?.error || 'Ошибка входа' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout/');
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const register = async (username, email, password1, password2) => {
    try {
      const csrfRes = await api.get('/csrf/');
      const csrfToken = csrfRes.data.csrfToken;

      const res = await api.post('/register/', { username, email, password1, password2 }, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      // После регистрации обычно перенаправляют на страницу входа
      return { success: true };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, errors: err.response?.data };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};