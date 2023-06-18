require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateChatReply(prompt, previousConversation, systemPrompt) {
  try {

    const prevChats = previousConversation.length === 0 ? [] : previousConversation.map((message) => ({ ...message }))
    
    const conversation = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
      ...prevChats, 
    ];

    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL,
      messages: conversation,
    });

    const assistantReply = response.data.choices[0].message.content;
    console.log('Assistant Reply:', assistantReply);

    return assistantReply;
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
}

// Usage example:
// const prompt = 'what is your full name?';
// const previousConversation = [
//   // { role: 'assistant', content: 'What are your plans for the future of Tesla?' },
//   // Include previous messages from the conversation
// ];


// (async () => {
//   try {
//     await generateChatReply(prompt, previousConversation);
//   }catch(e) {
//     console.error(e.data)
//   }
// })();

module.exports = { generateChatReply }
