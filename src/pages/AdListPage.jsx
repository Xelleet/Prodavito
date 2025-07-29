import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AdItem from '../components/AdItem';
import './AdList.css';

const AdListPage = () => {
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState({ next: null, previous: null, count: 0 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    page: parseInt(searchParams.get('page') || '1'),
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const params = { ...filters };
        const res = await api.get('http://127.0.0.1:8000/api/ads/', { params });

        setAds(res.data.results || []);
        setPagination({
          next: res.data.next,
          previous: res.data.previous,
          count: res.data.count,
        });
      } catch (err) {
        console.error('Ошибка загрузки объявлений:', err);
        setAds([]);
      }
    };
    fetchAds();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    setSearchParams({ ...filters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    setSearchParams({ ...filters, page: newPage });
  };

  const totalPages = Math.ceil(pagination.count / 5); // если PAGE_SIZE = 5

  return (
    <div className="ad-list-page">
      <h2>Список объявлений</h2>
      <form onSubmit={handleSearch} className="ad-filter-form" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        <input type="text" name="q" placeholder="Поиск..." value={filters.q} onChange={handleFilterChange} />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Все категории</option>
          <option value="tech">Техника</option>
          <option value="cars">Автомобили</option>
          <option value="work">Работа</option>
        </select>
        <select name="condition" value={filters.condition} onChange={handleFilterChange}>
          <option value="">Все состояния</option>
          <option value="new">Новый</option>
          <option value="used">Б/у</option>
        </select>
        <button type="submit">Искать</button>
        <button type="button" onClick={() => {
          setFilters({ q: '', category: '', condition: '', page: 1 });
          setSearchParams({});
        }}>Сбросить</button>
      </form>

      <div className="ad-list">
        {ads.length === 0 ? (
          <div className="ad-list-empty">Нет объявлений</div>
        ) : (
          <ul className="ad-list-grid">
            {ads.map(ad => (
              <AdItem key={ad.id} ad={ad} />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={() => handlePageChange(filters.page - 1)} disabled={!pagination.previous || filters.page <= 1}>
            ← Назад
          </button>
          <span>Страница {filters.page} из {totalPages}</span>
          <button onClick={() => handlePageChange(filters.page + 1)} disabled={!pagination.next || filters.page >= totalPages}>
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdListPage;
