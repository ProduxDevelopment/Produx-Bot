const fs = require("fs");
const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();
client.logger = require("./modules/Logger");
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
client.logger.log(`Loading a total of ${commandFiles.length} commands.`);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  client.logger.log(`Loading Command: ${command.name}`);
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
client.logger.log(`Loading a total of ${eventFiles.length} events.`);

for (const file of eventFiles) {
  const eventName = file.split(".")[0];
  client.logger.log(`Loading Event: ${eventName}`);
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

client.login(process.env.TOKEN);
