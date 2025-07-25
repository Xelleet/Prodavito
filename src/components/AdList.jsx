// src/components/AdList.js
import React from 'react';
import AdItem from './AdItem';
import './AdList.css'; // Убедитесь, что этот файл существует

const AdList = ({ ads, onFilter, filters, searchTerm }) => {
  return (
    <div className="ad-list">
      {/* Форма фильтрации, если она должна быть частью списка */}
      <form onSubmit={onFilter} className="ad-filter-form">
        <input
          type="text"
          name="q"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => { /* Обработчик изменения поиска */ }}
        />
        <select name="category" value={filters.category} onChange={(e) => { /* Обработчик */ }}>
          <option value="">Все категории</option>
          <option value="tech">Техника</option>
          <option value="cars">Автомобили</option>
          <option value="work">Работа</option>
        </select>
        <select name="condition" value={filters.condition} onChange={(e) => { /* Обработчик */ }}>
          <option value="">Все состояния</option>
          <option value="new">Новый</option>
          <option value="used">Б/у</option>
        </select>
        <button type="submit">Фильтровать</button>
      </form>

      <ul>
        {ads.map(ad => (
          <AdItem key={ad.id} ad={ad} />
        ))}
      </ul>
    </div>
  );
};

export default AdList;