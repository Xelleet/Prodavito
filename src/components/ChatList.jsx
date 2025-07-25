// src/components/ChatList.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Chat.css'; // Создайте или используйте существующий файл стилей

const ChatList = ({ users }) => {
  return (
    <div className="chat-list">
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

export default ChatList;