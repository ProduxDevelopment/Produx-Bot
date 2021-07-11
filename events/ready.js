module.exports = async (client) => {
  client.logger.ready(
    `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
};
