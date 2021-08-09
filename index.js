console.clear();
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});
client.logger = require("./modules/Logger");
client.utils = require("./modules/Utils");
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  //client.logger.log(`Loading Command: ${command.name}`);
}
client.logger.log(`${commandFiles.length} commands have been loaded.`);

if (!fs.existsSync("db.json")) {
  try {
    client.logger.warn("db.json does not exist, making it now.");
    fs.writeFileSync("db.json", JSON.stringify({}));
  } catch (err) {
    client.logger.error("Something went wrong while making db.json");
    console.error(err);
  }
} else {
  client.logger.log("db.json ready.");
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const eventName = file.split(".")[0];
  //client.logger.log(`Loading Event: ${eventName}`);
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}
client.logger.log(`${eventFiles.length} events have been loaded.`);

client.login(process.env.TOKEN);
