const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v1: uuid, } = require('uuid');
const { generateChatReply } = require('./services/openai')

// Initialize the Firebase Admin SDK with a service account
const serviceAccount = require('./firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.processNewMessage = functions.firestore
  .document('Conversations/{conversationId}/Messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const newMessageData = snapshot.data();

    const { isSystemGenerated, modelId, content, messageId } = newMessageData
    const { conversationId } = context.params

    if (isSystemGenerated) {
      // This message is system-generated, no further processing needed
      return null;
    }

    if(!modelId) {
      console.error('modelId not found in inserted message')
      return null
    }

    if(!content) {
      console.error('content missing in message')
      return null
    }

    if(!messageId) {
      console.error('messageId missing in message')
      return null
    }


    // Retrieve the model reference from the Models collection using modelId
    const modelRef = admin.firestore().collection('Models').doc(modelId);
    const modelDoc = await modelRef.get();

    if (!modelDoc.exists) {
      // Model document not found, handle the error or return
      console.error(`Model document with id ${modelId} does not exist.`);
      return null;
    }

    // Get the prompt attribute value from the model document
    const systemPrompt = modelDoc.data().prompt;

    // Retrieve the latest 5 messages from the Messages subcollection of the same conversation
    const messagesRef = admin.firestore().collection('Conversations').doc(conversationId).collection('Messages');
    const querySnapshot = await messagesRef.orderBy('timestamp', 'desc').limit(5).get();

    let previousConversation = []
    
    // Extract the role and content attributes from the messages
    querySnapshot.docs.forEach((doc) => {
      const messageData = doc.data();

      const { role, content } = messageData

        if(role && content && role !== 'system') {
          previousConversation.push({
            role,
            content
          })
        }
    });

    console.log('previousconverasation: ', previousConversation)


    const reply = await generateChatReply(content, previousConversation, systemPrompt)

    // Set a flag indicating that the next message will be system-generated
    const nextMessageData = {
      isSystemGenerated: true,
      messageId: uuid(),
      role: "assistant",
      content: reply,
      timestamp: new Date().getTime(),
      replyTo: messageId,
      modelId: modelId
    };

    // Insert the response as a new message in the Messages subcollection    
    return messagesRef.add(nextMessageData);
  });
