const { testServer } = require('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = (client, c) => {
  const localCommands = getLocalCommands();
}