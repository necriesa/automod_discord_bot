const OpenAI = require('openai');
const { ApplicationCommandOptionType } = require('discord.js');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

module.exports = {
  name: 'ask',
  description: 'Ask OpenAI Something!',
  options: [
    {
    name: 'prompt',
    description: 'Your question for ChatGPT',
    type: ApplicationCommandOptionType.String,
    required: true,
    }
  ],
  run: async (client, interaction) => {
    const prompt = interaction.options.getString('prompt');
  
    await interaction.deferReply();
  
    try {
      const response = await openai.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      });
  
    const reply = response.choices?.[0]?.message?.content?.trim();

      if (reply) {
        await interaction.editReply(reply);
      }
      else {
        await interaction.editReply("⚠️ DeepSeek returned an empty response.");
      }
    } catch (err) {
      console.error('OpenRouter/DeepSeek Error:', err);
      let errorMsg = '❌ Something went wrong talking to DeepSeek.';
      if (err.status === 429 || err.code === 'insufficient_quota') {
        errorMsg = '🚫 Quota exceeded. Check your usage on https://openrouter.ai/keys.';
      }
      await interaction.editReply(errorMsg);
    }
  }
}