require('dotenv').config();

const fs = require('fs');
const client = require('./client');
const mongoose = require('mongoose')
const token = process.env.DISCORD_TOKEN || "";

// utils
const updateInfraction = require('./utils/moderation/userInfractions');

const badWords = JSON.parse(fs.readFileSync('./profanity.json', 'utf8'));

const { Events } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

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
