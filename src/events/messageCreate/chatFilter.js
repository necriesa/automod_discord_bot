const fs = require('fs');
const path = require('path');
const updateInfraction = require('../../utils/moderation/userInfractions');

const badWords = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../profanity.json'), 'utf8')
);

module.exports = (_, message) => {
  const words = message.content.toLowerCase().split(/\s+/);

  if (words.some(word => badWords.includes(word))) {
    message.channel.send(`${message.author} said a bad word D:`)
      .then(() => console.log(`Filtered a bad word from ${message.author.tag}`))
      .catch(console.error);

    message.delete().catch(console.error);

    updateInfraction(message);
  }
};

