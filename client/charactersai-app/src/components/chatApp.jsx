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
    const fetchMessages = async () => {
      const conversationRef = firestore.collection('Conversations').doc(modelId);

      const snapshot = await conversationRef.collection('Messages').get();
      const messageData = snapshot.docs.map((doc) => doc.data());
      setMessages(messageData);
    };

    fetchMessages();
  }, [modelId]);

  const handleMessageSend = async () => {
    if (message.trim() === '') {
      return;
    }

    const conversationRef = firestore.collection('Conversations').doc(modelId);
    const messagesRef = conversationRef.collection('Messages');

    const conversationSnapshot = await conversationRef.get();
    if (!conversationSnapshot.exists) {
      const newConversation = {
        conversationId: uuidv4(),
        modelId: modelId,
        userId: '123',
      };

      await conversationRef.set(newConversation);
    }

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
            <p key={msg.messageId}>{msg.content}</p>
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
