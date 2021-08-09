module.exports = {
  name: "lock",
  description: "Lock Channel mentioned.",
  permissions: ["Team"],
  usage: "[Channels]",
  options: [
    {
      name: "channel",
      description: "Select a channel to lock",
      type: "CHANNEL",
    },
  ],
  async execute(interaction) {
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === "Member"
    );
    if (!role) return interaction.reply("I can't find the Member role.");
    const channel = interaction.options.getChannel("channel");
    if (channel) {
      if (channel.name.startsWith("🔒"))
        return await interaction.reply(`<#${channel.id}> is already locked!`);
      await channel.setName(`🔒${channel.name}`);
      try {
        await channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: false,
        });
        interaction.reply(`<#${channel.id}> has been locked!`);
      } catch (err) {
        console.error(err);
        interaction.reply("Something went wrong!");
      }
      interaction.guild.channels.cache
        .find((c) => c.name === "logs")
        .send({
          embeds: [
            {
              color: "FFD700",
              timestamp: new Date(),
              title: "🔒 Channel locked",
              fields: [
                {
                  name: "Channel:",
                  value: `<#${channel.id}>`,
                },
                {
                  name: "Moderator:",
                  value: `${interaction.user} (${interaction.user.id})`,
                },
              ],
            },
          ],
        });
    }
    if (!channel) {
      if (interaction.channel.name.startsWith("🔒"))
        return interaction.reply(
          `<#${interaction.channel.id}> is already locked!`
        );
      await interaction.channel.setName(`🔒${interaction.channel.name}`);
      try {
        await interaction.channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: false,
        });
        interaction.reply(`<#${interaction.channel.id}> has been locked!`);
        interaction.guild.channels.cache
          .find((c) => c.name === "logs")
          .send({
            embeds: [
              {
                color: "FFD700",
                timestamp: new Date(),
                title: "🔒 Channel locked",
                fields: [
                  {
                    name: "Channel:",
                    value: `<#${interaction.channel.id}>`,
                  },
                  {
                    name: "Moderator:",
                    value: `${interaction.user} (${interaction.user.id})`,
                  },
                ],
              },
            ],
          });
      } catch (err) {
        console.error(err);
        interaction.reply("Something went wrong!");
      }
    }
  },
};
