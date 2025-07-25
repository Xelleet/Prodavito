// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterForm.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password1: '', password2: '' });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = await register(formData.username, formData.email, formData.password1, formData.password2);
    if (result.success) {
      alert('Регистрация успешна! Теперь вы можете войти.');
      navigate('/login');
    } else {
      setErrors(result.errors || { non_field_errors: [result.error] });
    }
  };

  return (
    <div className="register-page">
      <h2>Регистрация</h2>
      {errors.non_field_errors && errors.non_field_errors.map((err, i) => <p key={i} className="error">{err}</p>)}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Имя пользователя:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          {errors.username && errors.username.map((err, i) => <span key={i} className="error">{err}</span>)}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          {errors.email && errors.email.map((err, i) => <span key={i} className="error">{err}</span>)}
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input type="password" name="password1" value={formData.password1} onChange={handleChange} required />
          {errors.password1 && errors.password1.map((err, i) => <span key={i} className="error">{err}</span>)}
        </div>
        <div className="form-group">
          <label>Подтвердите пароль:</label>
          <input type="password" name="password2" value={formData.password2} onChange={handleChange} required />
          {errors.password2 && errors.password2.map((err, i) => <span key={i} className="error">{err}</span>)}
        </div>
        <button type="submit" className="auth-button">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
};

export default RegisterPage;