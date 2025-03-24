const Users = require('../../database/userSchema');
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
      user.infractionCount += 1;
      user.infractionDate = message.createdAt;
      
      await user.save().catch((e) => {
        console.log(`Error updating user infractions: ${e.message}`)
        return;
      });

      // user gets a ramping punishment based on number of infractions
      if (user.infractionCount >= 3) {
        await message.member.timeout(5 * 60 * 1000, `${author.displayName} has been too naughty!`).
        then(console.log).catch(console.error);
      }
      else if (user.infractionCount >= 5) {
        await message.member.timeout(10 * 60 * 1000, `${author.displayName} has been too naughty!`).
        then(console.log).catch(console.error);
      }
      else if (user.infractionCount >= 10) {
        await message.member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: `${author.displayName} was spamming profanity!` }).
        then(console.log).catch(console.error);
      }
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