const fs = require("fs");
const { Client, Collection, Intents } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.logger = require("./modules/Logger");
client.utils = require("./modules/Utils");
client.commands = new Collection();

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

client.on('interactionCreate', async interaction => {
  console.log(interaction)
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong.');
	} else if (interaction.commandName === 'beep') {
		await interaction.reply('Boop!');
	}
	// ...
});

client.login(process.env.TOKEN);
