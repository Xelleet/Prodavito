// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-title">
        <Link to="/">Объявления</Link>
      </div>
      <nav className="header-nav">
        <Link to="/ads/create">Создать объявление</Link>
        <Link to="/chat">Чат</Link>
        <Link to="/ads">Все объявления</Link>
        <Link to="/login">Войти</Link>
        <Link to="/register">Регистрация</Link>
      </nav>
    </header>
  );
};

export default Header;