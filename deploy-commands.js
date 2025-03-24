const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask ChatGPT something!')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Your question for ChatGPT')
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering GUILD slash command...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.SERVER_ID
      ),
      { body: commands }
    );
    console.log('Guild slash command registered!');
  } catch (error) {
    console.error(error);
  }
})();
