// src/pages/AdCreatePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdForm.css';

const AdCreatePage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', image_url: '', category: '', condition: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CSRF токен
      const csrfRes = await api.get('/csrf/');
      const csrfToken = csrfRes.data.csrfToken;

      await api.post('/add_ad/', formData, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      navigate('/ads');
    } catch (err) {
      console.error("Ошибка создания объявления:", err);
      setError('Не удалось создать объявление.');
    }
  };

  return (
    <div className="ad-form-page">
      <h2>Добавить объявление</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="ad-form">
        <div className="form-group">
          <label>Заголовок:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Описание:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>URL изображения:</label>
          <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Категория:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Выберите категорию</option>
            <option value="tech">Техника</option>
            <option value="cars">Автомобили</option>
            <option value="work">Работа</option>
          </select>
        </div>
        <div className="form-group">
          <label>Состояние:</label>
          <select name="condition" value={formData.condition} onChange={handleChange} required>
            <option value="">Выберите состояние</option>
            <option value="new">Новый</option>
            <option value="used">Б/у</option>
          </select>
        </div>
        <button type="submit" className="auth-button">Добавить</button>
      </form>
    </div>
  );
};

export default AdCreatePage;