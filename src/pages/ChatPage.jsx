// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Chat.css';

const ChatPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/chat/inbox/', {
        withCredentials: true,
      });
      console.log('Chat users response:', res.data);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Ошибка загрузки пользователей чата:", err);
      setUsers([]);
    }
  };

  fetchUsers();
}, []);

  return (
    <div className="chat-page">
      <h2>Ваша переписка</h2>
      <ul className="chat-user-list">
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/chat/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
      <Link to="/ads">Назад</Link>
    </div>
  );
};

export default ChatPage;