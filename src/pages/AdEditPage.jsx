// src/pages/AdEditPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdForm.css';

const AdEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '', description: '', image_url: '', category: '', condition: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ad_update/${id}/`); // Получение данных для формы
        setFormData(res.data); // Предполагаем, что Django возвращает данные объявления
      } catch (err) {
        console.error("Ошибка загрузки объявления:", err);
        setError('Не удалось загрузить объявление.');
      }
    };

    fetchAd();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfRes = await api.get('/csrf/');
      const csrfToken = csrfRes.data.csrfToken;

      await api.post(`/ad_update/${id}/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      navigate('/ads');
    } catch (err) {
      console.error("Ошибка обновления объявления:", err);
      setError('Не удалось обновить объявление.');
    }
  };

  return (
    <div className="ad-form-page">
      <h2>Редактировать объявление</h2>
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
        <button type="submit" className="auth-button">Сохранить</button>
      </form>
    </div>
  );
};

export default AdEditPage;