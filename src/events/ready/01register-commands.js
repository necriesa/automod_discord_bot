const { testServer } = require('../../../config.json');
const checkCommandsDifference = require('../../utils/checkCommandsDifference');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = async (client, c) => {
  try {
    // retrieve locally stored commands on bot and commands stored in server
    const localCommands = getLocalCommands();
    const appCommands = await getApplicationCommands(client, testServer);

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await appCommands.cache.find(
        (cmd) => cmd.name === name
      );

      // check if command is slated for deletion
      if (existingCommand) {
        if (localCommand.deleted) {
          await appCommands.delete(existingCommand.id);
          console.log(`Deleted command "${name}".`);
          continue;
        }
      }

      // check if the server's command version is up to date with locally stored command
      if (checkCommandsDifference(existingCommand, localCommand)) {
        await appCommands.edit(existingCommand.id, {
          description,
          options
        });

        console.log(`Edited command: "${name}".`);
      }
      else {
        if (localCommand.deleted) {
          console.log(`Skipping registering command "${name}" as it's set to be deleted.`);
          continue;
        }
        
        await appCommands.create({
          name,
          description,
          options
        });

        console.log(`Command "${name}" was successfully registered.`)
      }
    }
  } catch (error) {
    console.log(`There was an error adding a command: ${error}`)
  }
}