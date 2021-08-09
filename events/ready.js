module.exports = async (client) => {
  client.logger.ready(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
  try {
    const commands = client.commands.map(({ execute, ...data }) => data);
    const fullPermissions = [];
    await client.guilds.cache
      .get("856241400227430410")
      ?.commands.set(commands)
      .then((i) => {
        i.forEach((command) => {
          fullPermissions.push({
            id: command.id,
            permissions: [
              {
                id: "856246555459715102",
                type: "ROLE",
                permission: true,
              },
            ],
          });
        });
      });
    await client.guilds.cache
      .get("856241400227430410")
      ?.commands.permissions.set({ fullPermissions });
    client.logger.log("Slash commands have been updated.");
  } catch (error) {
    console.error(error);
  }
};
