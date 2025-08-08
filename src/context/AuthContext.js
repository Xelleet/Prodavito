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
      const res = await api.get('/api/me/', { withCredentials: true });
      setUser(res.data.user);
      console.log(user)
      //localStorage.setItem('user', JSON.stringify(res.data.user));
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
    await api.post('/api/logout/', {}, { withCredentials: true });
    setUser(null);
  } catch (err) {
    console.error('Logout failed', err);
  }

  try {
    const csrfRes = await api.get('/csrf/');
    const csrfToken = csrfRes.data.csrfToken;

    const res = await api.post('/api/login/', { username, password }, {
      headers: { 'X-CSRFToken': csrfToken },
      withCredentials: true
    });
    console.log(res.data.user)
    setUser(res.data.user);
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
    // сначала получаем csrf cookie
    await api.get('/csrf/');
    // берём csrf токен из куки (не из ответа!)
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const csrfToken = await api.get('/csrf/');

    const res = await api.post('/api/register/', { username, email, password1, password2 }, {
      headers: { 'X-CSRFToken': csrfToken }
    });

    return { success: true };
  } catch (err) {
    return { success: false, errors: err.response?.data || { non_field_errors: ['Ошибка сервера'] } };
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