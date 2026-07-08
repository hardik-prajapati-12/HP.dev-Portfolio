const OpenAI = require('openai');

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not configured. OpenAI replies are disabled.');
    return null;
  }

  return new OpenAI({ apiKey });
};

module.exports = { getOpenAIClient };
