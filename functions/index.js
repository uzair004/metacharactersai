const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v1: uuid } = require('uuid');
const { generateChatReply } = require('./services/openai');

// Initialize the Firebase Admin SDK with a service account
const serviceAccount = require('./firebase-credentials.json');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("Connecting to Firestore Emulator...");
  admin.firestore().settings({
    host: '127.0.0.1:8080',
    ssl: false, // Don't use SSL for the emulator
  });
} else {
  console.log("Connecting to production Firestore...");
}

exports.processNewMessage = functions.firestore
  .document('Conversations/{conversationId}/Messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const newMessageData = snapshot.data();

    const { isSystemGenerated, modelId, content, messageId, userId } = newMessageData;
    const { conversationId } = context.params;

    if (isSystemGenerated) {
      // This message is system-generated, no further processing needed
      return null;
    }

    const userQuerySnapshot = await admin.firestore()
      .collection('Users')
      .where('userId', '==', userId)
      .limit(1)
      .get()


    if(userQuerySnapshot.empty) {
      console.error(`user not found: userId: ${userId}`);
      return null;
    }

    const userDoc = userQuerySnapshot.docs[0];

    let { tokenCount, maxTokens } = userDoc.data();

    // user ran out of tokens
    if(typeof tokenCount === 'number' && typeof maxTokens === 'number' && maxTokens - tokenCount < 0) {
      console.error(`user doesn't have enough tokens, userId: ${userId}, tokenCount: ${tokenCount}, max: ${maxTokens}`)
      return null
    }

    if (!modelId) {
      console.error('modelId not found in inserted message');
      return null;
    }

    if (!content) {
      console.error('content missing in message');
      return null;
    }

    if (!messageId) {
      console.error('messageId missing in message');
      return null;
    }

    // Retrieve the model reference from the Models collection using modelId
    const modelQuerySnapshot = await admin.firestore()
      .collection('Models')
      .where('modelId', '==', modelId)
      .limit(1)
      .get();

    if (modelQuerySnapshot.empty) {
      // Model document not found, handle the error or return
      console.error(`Model document with id ${modelId} does not exist.`);
      return null;
    }

    const modelDoc = modelQuerySnapshot.docs[0];

    // Get the prompt attribute value from the model document
    const systemPrompt = modelDoc.data().prompt;

    // Retrieve the latest 5 messages from the Messages subcollection of the same conversation
    const messagesRef = admin.firestore()
      .collection('Conversations')
      .doc(conversationId)
      .collection('Messages');

    const querySnapshot = await messagesRef
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    let previousConversation = [];

    // Extract the role and content attributes from the messages
    querySnapshot.forEach((doc) => {
      const { role, content } = doc.data();

      if (role && content && role !== 'system') {
        previousConversation.push({
          role,
          content
        });
      }
    });

    previousConversation = previousConversation.reverse();

    const {assistantReply: reply, tokenUsed} = await generateChatReply(content, previousConversation, systemPrompt);

    console.log({reply, tokenUsed})

    // Set a flag indicating that the next message will be system-generated
    const nextMessageData = {
      isSystemGenerated: true,
      messageId: uuid(),
      role: 'assistant',
      content: reply,
      timestamp: new Date().getTime(),
      replyTo: messageId,
      modelId: modelId
    };

    // update tokenCount from chatgpt
    tokenCount !== undefined ? (tokenCount += tokenUsed) : 0;
   
    // new user
    if (!maxTokens) {
      // New user, add tokenCount & set maxTokens limit
      maxTokens = 1000;
    }

    await Promise.all([
      userDoc.ref.update({ tokenCount, maxTokens }),
      messagesRef.add(nextMessageData)
    ])

  });
