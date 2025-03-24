module.exports = (client) => {
  // client logs into console when the bot is ready
  client.on('ready', (c) =>{
    console.log(`${c.user.tag} is ready!`);
  });
}