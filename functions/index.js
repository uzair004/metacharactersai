const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v1: uuid, } = require('uuid');

// Initialize the Firebase Admin SDK with a service account
const serviceAccount = require('../firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.processNewMessage = functions.firestore
  .document('Conversations/{conversationId}/Messages/{messageId}')
  .onCreate((snapshot, context) => {
    const newMessageData = snapshot.data();
    const isSystemGenerated = newMessageData.isSystemGenerated || false;

    // Example:
    console.log('New message:', newMessageData)
    console.log('context: ', context)

    if (isSystemGenerated) {
      // This message is system-generated, no further processing needed
      return null;
    }

    // For example, call the ChatGPT API and update the document with the generated response
    // You can access the conversation and message IDs using context.params

    // Set a flag indicating that the next message will be system-generated
    const nextMessageData = {
      isSystemGenerated: true,
      messageId: uuid(),
      role: "assistant",
      content: 'I am elon musk',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      replyTo: newMessageData.messageId 
    };

    // Generate the response using the ChatGPT API
    // Insert the response as a new message in the Messages subcollection
    const conversationId = context.params.conversationId;
    const messagesRef = admin.firestore().collection('Conversations').doc(conversationId).collection('Messages');
    
    return messagesRef.add(nextMessageData);
  });
