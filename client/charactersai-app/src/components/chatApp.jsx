/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* ChatApp.jsx */

import React, { useState, useEffect } from 'react';
import defaultAvatar from '../assets/default-avatar.jpeg';
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

function ChatApp({ modelName, modelId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const conversationRef = firestore.collection('Conversations').doc(modelId);
    const messagesRef = conversationRef.collection('Messages');

    const unsubscribe = messagesRef.orderBy('timestamp').onSnapshot((snapshot) => {
      const messageData = snapshot.docs.map((doc) => doc.data());
      setMessages(messageData);
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, [modelId]);

  const handleMessageSend = async () => {
    if (message.trim() === '') {
      return;
    }

    const conversationRef = firestore.collection('Conversations').doc(modelId);
    const messagesRef = conversationRef.collection('Messages');

    const newMessage = {
      messageId: uuidv4(),
      content: message,
      role: 'user',
      timestamp: new Date().getTime(),
      modelId: modelId,
    };

    await messagesRef.doc(newMessage.messageId).set(newMessage);

    setMessage('');
  };

  return (
    <div className="container-fluid chat-container">
      <div className="row header">
        <div className="col-2">
          <img src={defaultAvatar} alt="Default Avatar" className="avatar" />
        </div>
        <div className="col-10 d-flex align-items-center">
          <h2 className="model-name">{modelName}</h2>
        </div>
      </div>
      <div className="row conversation">
        <div className="col-12">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`message ${msg.role === 'user' ? 'user' : 'other'}`}
              style={{
                backgroundColor: msg.role === 'user' ? '#2196f3' : '#f5f5f5',
                borderRadius: '10px',
                padding: '10px',
                marginBottom: '10px',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'user' ? '0' : 'auto',
                maxWidth: '50%',
              }}
            >
              <p style={{ color: msg.role === 'user' ? '#ffffff' : '#000000' }}>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="row input-container">
        <div className="col-10">
          <input
            type="text"
            placeholder="Type your message..."
            className="form-control input-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleMessageSend();
              }
            }}
          />
        </div>
        <div className="col-2 d-flex align-items-center">
          <button className="btn btn-primary send-button" onClick={handleMessageSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );  
}

export default ChatApp;
