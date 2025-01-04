import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    const newMessage = {
      username,
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    socket.emit('sendMessage', newMessage);
    setMessage('');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setIsLoggedIn(true)}>Login</button>
        </div>
      ) : (
        <div className="chat">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <span className="avatar">{msg.username[0]}</span>
                <div>
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{msg.timestamp}</span>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
