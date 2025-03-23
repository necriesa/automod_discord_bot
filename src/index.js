require('dotenv').config();

const fs = require('fs');
const client = require('./client');
const token = process.env.DISCORD_TOKEN || "";

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = "mongodb+srv://csnj22xs:<pHJUDPSmC5vXu9Tw>@discordbot.p4ju0.mongodb.net/?retryWrites=true&w=majority&appName=discordBot"

const badWords = JSON.parse(fs.readFileSync('./src/profanity.json', 'utf8'));

//attempt a login
client.login(token);

// Create MongoClient and set MongoClientOptions
const clientDB = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

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
