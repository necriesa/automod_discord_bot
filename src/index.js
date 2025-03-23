require('dotenv').config();

const fs = require('fs');
const client = require('./client');
const mongoose = require('mongoose')
const token = process.env.DISCORD_TOKEN || "";

const badWords = JSON.parse(fs.readFileSync('./src/profanity.json', 'utf8'));

// connect to MongoDB database
(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
})

//attempt a login
client.login(token);

// client logs into console when the bot is ready
client.on('ready', (c) =>{
    console.log(`${c.user.tag} is ready!`);
});

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
    }
});
