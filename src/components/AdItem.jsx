// src/components/AdItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdItem.css';

const AdItem = ({ ad }) => {
  const { user } = useAuth();

  return (
    <li className="ad-item" style={{background:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.06)',padding:20,display:'flex',flexDirection:'column',gap:12}}>
      {ad.image_url && (
        <div style={{width:'100%',height:180,background:'#f5f5f5',borderRadius:6,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src={ad.image_url} alt={ad.title} style={{maxWidth:'100%',maxHeight:'100%'}} />
        </div>
      )}
      <h3 style={{margin:'8px 0 4px 0',fontSize:'1.15rem'}}>{ad.title}</h3>
      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
        {ad.category && <span style={{background:'#e3eafc',color:'#1976d2',borderRadius:4,padding:'2px 8px',fontSize:13}}>{ad.category==='tech'?'Техника':ad.category==='cars'?'Автомобили':ad.category==='work'?'Работа':ad.category}</span>}
        {ad.condition && <span style={{background:'#f0f0f0',color:'#444',borderRadius:4,padding:'2px 8px',fontSize:13}}>{ad.condition==='new'?'Новый':'Б/у'}</span>}
        {ad.price && <span style={{fontWeight:600,color:'#388e3c',marginLeft:'auto'}}>{ad.price} ₽</span>}
      </div>
      <div style={{color:'#555',fontSize:15,minHeight:40}}>{ad.description}</div>
      {user && user.id === ad.user && (
        <div className="ad-item__actions" style={{marginTop:8,display:'flex',gap:8}}>
          <Link to={`/ads/edit/${ad.id}`} style={{color:'#1976d2'}}>Редактировать</Link>
          <Link to={`/ads/delete/${ad.id}`} style={{color:'#d32f2f'}}>Удалить</Link>
        </div>
      )}
    </li>
  );
};

export default AdItem;