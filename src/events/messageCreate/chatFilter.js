const fs = require('fs')
const badWords = JSON.parse(fs.readFileSync('../../../profanity.json', 'utf8'));
const updateInfraction = require('../../utils/moderation/userInfractions');

module.exports = (message) => {
  // client checks each new message that it can see for bad words
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
}