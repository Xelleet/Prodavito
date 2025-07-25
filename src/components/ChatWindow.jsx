// src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ChatWindow = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const chatLogRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получить данные о пользователе и сообщениях
        const userRes = await api.get(`/profile/${userId}/`); // Или другой эндпоинт
        setOtherUser(userRes.data);

        const messagesRes = await api.get(`/chat/${userId}/`);
        setMessages(messagesRes.data.messages || messagesRes.data);
      } catch (err) {
        console.error("Ошибка загрузки данных чата:", err);
      }
    };

    fetchData();

    // Настройка WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    ws.current = new WebSocket(
      `${protocol}://${window.location.host}/ws/chat/${userId}/`
    );

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, data]);
    };

    ws.current.onclose = (e) => {
      console.error('Соединение с чатом разорвано');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ 'message': newMessage }));
      setNewMessage('');
    } else {
      console.error('WebSocket не открыт');
    }
  };

  return (
    <div className="chat-window">
      <h2>Чат с {otherUser?.username}</h2>
      <div className="chat-log" ref={chatLogRef}>
        {messages.map((msg, index) => (
          <div key={index}><b>{msg.sender}</b>: {msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          autoFocus
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ChatWindow;