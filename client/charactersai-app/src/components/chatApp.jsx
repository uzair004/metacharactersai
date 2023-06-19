/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import defaultAvatar from '../assets/default-avatar.jpeg';

function ChatApp({ modelName }) {
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
          {/* Previous conversation */}
        </div>
      </div>
      <div className="row input-container">
        <div className="col-10">
          <input type="text" placeholder="Type your message..." className="form-control input-field" />
        </div>
        <div className="col-2 d-flex align-items-center">
          <button className="btn btn-primary send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
