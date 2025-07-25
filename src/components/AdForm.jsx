// src/components/AdForm.js
import React from 'react';
import './AdForm.css'; // Убедитесь, что этот файл существует

const AdForm = ({ formData, onChange, onSubmit, buttonText = "Сохранить" }) => {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form ad-form">
        {/* В React обычно не используется csrf_token напрямую в форме,
            токен передается в заголовках запроса */}
        <div className="form-group">
          <label htmlFor="title">Заголовок:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">URL изображения:</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Категория:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
          >
            <option value="">Выберите категорию</option>
            <option value="tech">Техника</option>
            <option value="cars">Автомобили</option>
            <option value="work">Работа</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="condition">Состояние:</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={onChange}
            required
          >
            <option value="">Выберите состояние</option>
            <option value="new">Новый</option>
            <option value="used">Б/у</option>
          </select>
        </div>
        <button type="submit" className="auth-button">{buttonText}</button>
      </form>
    </div>
  );
};

export default AdForm;