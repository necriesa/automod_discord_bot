require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');

const token = process.env.DISCORD_TOKEN || "";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers, // allows access to server members 
        IntentsBitField.Flags.GuildMessages, // allows access to create messages 
        IntentsBitField.Flags.MessageContent, // Corrected flag
        IntentsBitField.Flags.GuildMessageReactions, // allows access to create reactions
    ]
});

try{
    client.login(token)
    .then(() =>{
        console.log("Bot is logged in and online");
    });
}catch (err) {
    console.error(err);
}