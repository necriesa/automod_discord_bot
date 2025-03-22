require('dotenv').config();

const client  = require('./client');
const token = process.env.DISCORD_TOKEN || "";

//attempt a login
client.login(token);

// client logs into console when the bot is ready
client.on('ready', (c) =>{ 
    console.log(`${c.user.tag} is ready!`);
});

// client checks each new message that it can see for bad words
client.on('messageCreate', (message) => {
    const words = ["nigger", "faggot", "asswipe"];

    const splitMessage = message.content.toLowerCase().split(" ");

    if(splitMessage.some(item => words.includes(item))){

        //reply to the message: 
        message.channel.send(`${message.author} said a bad word D:`)
        .then(() => console.log(`filtered the badword of ${message.author.tag}`))
        .catch(console.error);

        //delete the message
        message.delete()
        .catch(console.error);
    }
});


