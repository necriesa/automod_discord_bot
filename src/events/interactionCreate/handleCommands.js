const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObj = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObj) return;

    // check if the command is either devs or testing only
    if (commandObj.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only devs can run this command!",
          ephemeral: true,
        });

        return;
      }
    }
    if (commandObj.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: "This command is not ready yet!",
          ephemeral: true,
        });

        return;
      }
    }

    // check if user has permissions to use this command
    if (commandObj.permisssionsRequired?.length) {
      for (const permission of commandObj.permisssionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "Insufficient User Permissions!",
            ephemeral: true,
          });
          return;
        }
      }
    }

    // check if bot has permissions to use this command
    if (commandObj.botPermissions?.length) {
      for (const permission of commandObj.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "Insufficient Bot Permissions!",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObj.run(client, interaction);
  } catch (error) {
    console.log(`Error running this command: ${error}`);
  }
}