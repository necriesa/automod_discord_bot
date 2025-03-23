const Users = require('./database/userSchema');
const { Message } = require('discord.js');

/**
 * Updates the infractions done by a user
 * @param {Message} message
 */
module.exports = async (message) => {
  const author = message.author;
  const query = {
    name: author.displayName,
    id: author.id
  }

  try {
    const user = await Users.findOne(query);

    if (user) {
      // user gets timed out for 5 mins after 3 infractions
      if (user.infractionCount >= 3) {
        message.member.timeout(5 * 60 * 1000, `${author.displayName} has been too naughty!`).
        then(console.log).catch(console.error);
    }

      user.infractionCount += 1;
      user.infractionDate = message.createdAt;

      await user.save().catch((e) => {
        console.log(`Error updating user infractions: ${e.message}`)
        return;
      });
    }
    else {
      // user doesn't exist yet
      const newUser = new Users ({
        name: author.displayName,
        id: author.id,
        infractionCount: 1,
        lastInfraction: message.createdAt
      });

      await newUser.save();
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}