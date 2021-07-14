module.exports = {
  name: "unlock",
  description: "Unlock Channel(s) mentioned.",
  permissions: ["Team"],
  usage: "[Channels]",
  async execute(client, message, args) {
    const role = message.guild.roles.cache.find(
      (role) => role.name === "Member"
    );
    if (!role) return message.reply("I can't find the Member role.");
    if (message.mentions.channels.first()) {
      message.mentions.channels.forEach(async (channel) => {
        if (!channel.name.startsWith("🔒"))
          return message.reply(`<#${channel.id}> is not locked!`);
        await channel.setName(channel.name.substring(1));
        try {
          await channel.updateOverwrite(role, {
            SEND_MESSAGES: true,
          });
          message.reply(`<#${channel.id}> has been unlocked!`);
        } catch (err) {
          console.error(err);
          message.reply("Something went wrong!");
        }
      });
    }
    if (!message.mentions.channels.first()) {
      if (!message.channel.name.startsWith("🔒"))
        return message.reply(`<#${message.channel.id}> is not locked!`);
      await message.channel.setName(message.channel.name.substring(1));
      try {
        await message.channel.updateOverwrite(role, {
          SEND_MESSAGES: true,
        });
        message.reply(`<#${message.channel.id}> has been unlocked!`);
      } catch (err) {
        console.error(err);
        message.reply("Something went wrong!");
      }
    }
  },
};