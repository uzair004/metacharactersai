require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], 
});

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
    const tokenUsed = response.data.usage.total_tokens;

    console.log('Assistant Reply:', assistantReply);

    return {assistantReply, tokenUsed};
  } catch (error) {
    console.error('Error:', error);
    // throw error;
    return {assistantReply: 'something went wrong', tokenUsed: 10}
  }
}

module.exports = { generateChatReply }
