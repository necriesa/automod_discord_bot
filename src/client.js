const {Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers, // allows access to server members
        IntentsBitField.Flags.GuildMessages, // allows access to create messages
        IntentsBitField.Flags.MessageContent, // Corrected flag
        IntentsBitField.Flags.GuildMessageReactions, // allows access to create reactions
    ]
});

module.exports = client;