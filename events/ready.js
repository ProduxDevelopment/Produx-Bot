module.exports = async (client) => {
  client.logger.ready(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
  try {
    console.log("Started refreshing application (/) commands.");
    const commands = client.commands.map(({ execute, ...data }) => data);
    await client.guilds.cache.get("863559556416143361")?.commands.set(commands);

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
