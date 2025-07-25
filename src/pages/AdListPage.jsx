// src/pages/AdListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AdItem from '../components/AdItem';
import './AdList.css';

const TEST_ADS = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max',
    description: 'Состояние: Новый. Гарантия. Полный комплект.',
    image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-max-model-unselect-gallery-1-202209?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1660753619946',
    category: 'tech',
    condition: 'new',
    price: '120000',
    user: 1
  },
  {
    id: 2,
    title: 'BMW X5 2020',
    description: 'Пробег 20 000 км. Один владелец. Отличное состояние.',
    image_url: 'https://cdn.bmw.ru/bmw/offer/2020/x5/x5-2020-1.jpg',
    category: 'cars',
    condition: 'used',
    price: '4500000',
    user: 2
  },
  {
    id: 3,
    title: 'Frontend-разработчик',
    description: 'Удалённая работа. Требуется опыт с React.',
    image_url: '',
    category: 'work',
    condition: '',
    price: '',
    user: 3
  }
];

const AdListPage = () => {
  const [ads, setAds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || ''
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Для теста: если API не отвечает, показываем тестовые объявления
        const res = await api.get('/?q=' + filters.q + '&category=' + filters.category + '&condition=' + filters.condition);
        setAds(res.data.ads || res.data);
      } catch (err) {
        setAds(TEST_ADS);
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
    setSearchParams(filters);
  };

  return (
    <div className="ad-list-page">
      <h2>Список объявлений</h2>
      <form onSubmit={handleSearch} className="ad-filter-form" style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:24}}>
        <input
          type="text"
          name="q"
          placeholder="Поиск по названию или описанию..."
          value={filters.q}
          onChange={handleFilterChange}
          style={{padding:'8px',borderRadius:4,border:'1px solid #ccc',minWidth:220}}
        />
        <select name="category" value={filters.category} onChange={handleFilterChange} style={{padding:'8px',borderRadius:4,border:'1px solid #ccc'}}>
          <option value="">Все категории</option>
          <option value="tech">Техника</option>
          <option value="cars">Автомобили</option>
          <option value="work">Работа</option>
        </select>
        <select name="condition" value={filters.condition} onChange={handleFilterChange} style={{padding:'8px',borderRadius:4,border:'1px solid #ccc'}}>
          <option value="">Все состояния</option>
          <option value="new">Новый</option>
          <option value="used">Б/у</option>
        </select>
        <button type="submit" style={{padding:'8px 18px',borderRadius:4,background:'#1976d2',color:'#fff',border:'none',fontWeight:500,cursor:'pointer'}}>Искать</button>
        <button type="button" style={{padding:'8px 18px',borderRadius:4,background:'#eee',color:'#222',border:'none',fontWeight:500,cursor:'pointer'}} onClick={()=>{setFilters({q:'',category:'',condition:''});setSearchParams({});}}>Сбросить</button>
      </form>
      <div className="ad-list">
        {ads.length === 0 ? (
          <div className="ad-list-empty">Нет объявлений</div>
        ) : (
          <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:24,padding:0,listStyle:'none'}}>
            {ads.map(ad => (
              <AdItem key={ad.id} ad={ad} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdListPage;