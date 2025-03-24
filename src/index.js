require('dotenv').config();

const client = require('./client');
const mongoose = require('mongoose')
const token = process.env.DISCORD_TOKEN || "";
const eventHandler = require('./handlers/eventHandler');

// attempt to connect to MongoDB database and login
mongoose.connect(process.env.MONGODB_URI).then(() => {
  eventHandler(client);
  client.login(token);
}).catch( (err) => {console.log(`Error: ${err.message}`)} );
