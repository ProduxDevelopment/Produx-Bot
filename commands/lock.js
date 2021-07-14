module.exports = {
  name: "lock",
  description: "Lock Channel(s) mentioned.",
  permissions: ["Team"],
  usage: "[Channels]",
  async execute(client, message, args) {
    const role = message.guild.roles.cache.find(
      (role) => role.name === "Member"
    );
    if (!role) return message.reply("I can't find the Member role.");
    if (message.mentions.channels.first()) {
      message.mentions.channels.forEach(async (channel) => {
        if (channel.name.startsWith("🔒"))
          return message.reply(`<#${channel.id}> is already locked!`);
        await channel.setName(`🔒${channel.name}`);
        try {
          await channel.updateOverwrite(role, {
            SEND_MESSAGES: false,
          });
          message.reply(`<#${channel.id}> has been locked!`);
        } catch (err) {
          console.error(err);
          message.reply("Something went wrong!");
        }
      });
      client.channels.cache.get(process.env.LOGS_CHANNEL_ID).send({
        embed: {
          color: "FFD700",
          timestamp: new Date(),
          title: "🔒 Channel(s) locked",
          fields: [
            {
              name: "Channel(s):",
              value: message.mentions.channels
                .map((channel) => `<#${channel.id}>`)
                .join("\n"),
            },
            {
              name: "Moderator:",
              value: `${message.author} (${message.author.id})`,
            },
          ],
        },
      });
    }
    if (!message.mentions.channels.first()) {
      if (message.channel.name.startsWith("🔒"))
        return message.reply(`<#${message.channel.id}> is already locked!`);
      await message.channel.setName(`🔒${message.channel.name}`);
      try {
        await message.channel.updateOverwrite(role, {
          SEND_MESSAGES: false,
        });
        message.reply(`<#${message.channel.id}> has been locked!`);
        client.channels.cache.get(process.env.LOGS_CHANNEL_ID).send({
          embed: {
            color: "FFD700",
            timestamp: new Date(),
            title: "🔒 Channel locked",
            fields: [
              {
                name: "Channel:",
                value: message.channel,
              },
              {
                name: "Moderator:",
                value: `${message.author} (${message.author.id})`,
              },
            ],
          },
        });
      } catch (err) {
        console.error(err);
        message.reply("Something went wrong!");
      }
    }
  },
};
