require('dotenv').config();

const fs = require('fs');
const client = require('./client');
const { Events } = require('discord.js');
const OpenAI = require('openai');

const token = process.env.DISCORD_TOKEN || "";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

  

// const badWords = JSON.parse(fs.readFileSync('./profanity.json', 'utf8'));

//attempt a login
client.login(token);

// client logs into console when the bot is ready
client.on('ready', (c) =>{
    console.log(`${c.user.tag} is ready!`);
});

// client checks each new message that it can see for bad words
// client.on('messageCreate', (message) => {

//     const words = message.content.toLowerCase().split(/\s+/);

//     if (words.some(word => badWords.includes(word))) {

//         //reply to the message:
//         message.channel.send(`${message.author} said a bad word D:`)
//           .then(() => console.log(`Filtered a bad word from ${message.author.tag}`))
//           .catch(console.error);
        
//         //delete the message
//         message.delete().catch(console.error);
//     }
// });

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
  
  


