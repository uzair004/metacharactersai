const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const { User, Model, Conversation, Message } = require('../../models');

// Initialize Firebase Admin SDK
const serviceAccount = require('./../firebase-credentials.json');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  // Sample data
  const users = [
    new User(uuidv4(), 'testuser1', 'testuser1@example.com', 'Test User 1'),
    new User(uuidv4(), 'testuser2', 'testuser2@example.com', 'Test User 2')
  ];

  const models = [
    new Model(uuidv4(), 'ElonAI', 'You are Elon Musk, your job is to answer questions as Elon Musk. You are the CEO of SpaceX and Tesla, and a co-founder of Neuralink and OpenAI.', 2048),
    new Model(uuidv4(), 'LawyerAI', 'You are a lawyer. Your job is to answer questions with legal advice. Provide thorough and accurate legal information.', 512)
  ];

  const conversations = [
    { userId: users[0].userId, modelId: models[0].modelId },
    { userId: users[1].userId, modelId: models[1].modelId }
  ];

  const messages = [
    { role: 'user', content: 'Hello, how are you?', replyTo: null, modelId: models[0].modelId },
    { role: 'bot', content: 'I am fine, thank you!', replyTo: null, modelId: models[0].modelId },
    { role: 'user', content: 'Tell me a joke.', replyTo: null, modelId: models[1].modelId },
    { role: 'bot', content: 'Why did the scarecrow win an award? Because he was outstanding in his field!', replyTo: null, modelId: models[1].modelId }
  ];

  // Add users to Firestore
  for (const user of users) {
    await db.collection('Users').doc(user.userId).set({
      username: user.username,
      email: user.email,
      name: user.name
    });
  }

  // Add models to Firestore
  for (const model of models) {
    await db.collection('Models').doc(model.modelId).set({
      name: model.name,
      prompt: model.prompt,
      contextSize: model.contextSize
    });
  }

  // Add conversations to Firestore
  const conversationRefs = [];
  for (const conversation of conversations) {
    const conversationRef = await db.collection('Conversations').add({
      userId: conversation.userId,
      modelId: conversation.modelId
    });
    conversationRefs.push(conversationRef.id);
  }

  // Add messages to Firestore
  for (let i = 0; i < messages.length; i++) {
    const conversationId = conversationRefs[Math.floor(i / 2)];
    await db.collection('Conversations').doc(conversationId).collection('Messages').add({
      role: messages[i].role,
      content: messages[i].content,
      timestamp: new Date(),
      replyTo: messages[i].replyTo,
      modelId: messages[i].modelId
    });
  }

  console.log('Data seeded successfully');
}

// Run the seed function
seedData().catch(console.error);
