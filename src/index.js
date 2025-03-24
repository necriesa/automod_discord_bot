require('dotenv').config();

const fs = require('fs');
const client = require('./client');
const mongoose = require('mongoose')
const token = process.env.DISCORD_TOKEN || "";

// database schemas
const updateInfraction = require('./utils/moderation/userInfractions');
const Users = require('./database/userSchema');

const badWords = JSON.parse(fs.readFileSync('./profanity.json', 'utf8'));

const { Events } = require('discord.js');
const OpenAI = require('openai');
const eventHandler = require('./handlers/eventHandler');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

// attempt to connect to MongoDB database and login
mongoose.connect(process.env.MONGODB_URI).then(() => {
  eventHandler(client);
  client.login(token);
}).catch( (err) => {console.log(`Error: ${err.message}`)} )

// client checks each new message that it can see for bad words
client.on('messageCreate', (message) => {

    const words = message.content.toLowerCase().split(/\s+/);

    if (words.some(word => badWords.includes(word))) {

        //reply to the message:
        message.channel.send(`${message.author} said a bad word D:`)
          .then(() => console.log(`Filtered a bad word from ${message.author.tag}`))
          .catch(console.error);
        
        //delete the message
        message.delete().catch(console.error);

        // update infraction info for user
        updateInfraction(message);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'ask') return;
  
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
  });
