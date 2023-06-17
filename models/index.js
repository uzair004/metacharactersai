// models.js

// User schema
class User {
    constructor(userId, username, email) {
      this.userId = userId;
      this.username = username;
      this.email = email;
    }
  }
  
  // Model schema
  class Model {
    constructor(modelId, name, prompt, contextSize) {
      this.modelId = modelId;
      this.name = name;
      this.prompt = prompt;
      this.contextSize = contextSize;
    }
  }
  
  // Conversation schema
  class Conversation {
    constructor(conversationId, userId, modelId) {
      this.conversationId = conversationId;
      this.userId = userId;
      this.modelId = modelId;
    }
  }
  
  // Message schema
  class Message {
    constructor(messageId, role, content, timestamp) {
      this.messageId = messageId;
      this.role = role;
      this.content = content;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = {
    User,
    Model,
    Conversation,
    Message,
  };
  