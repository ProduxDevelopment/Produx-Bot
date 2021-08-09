module.exports = {
  name: "clear",
  description: "Delete messages",
  permissions: ["Team"],
  usage: "[amount]",
  options: [
    {
      name: "num",
      description: "Enter a number",
      type: "NUMBER",
      required: true,
    },
  ],
  async execute(interaction) {
    const amount = await interaction.options.getNumber("num");

    if (amount <= 1 || amount > 100) {
      return interaction.reply({
        content: "You need to input a number between 1 and 99.",
        ephemeral: true,
      });
    }

    interaction.channel
      .bulkDelete(amount, true)
      .then((messages) => {
        interaction.reply({
          content: `Deleted ${messages.size} messages`,
          ephemeral: true,
        });
        interaction.guild.channels.cache
          .find((c) => c.name === "logs")
          .send({
            embeds: [
              {
                timestamp: new Date(),
                title: "Messages Bulk Deleted",
                fields: [
                  {
                    name: "Amount:",
                    value: messages.size.toString(),
                  },
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
      })
      .catch((err) => {
        console.error(err);
        interaction.reply({
          content:
            "There was an error trying to clear messages in this channel!",
          ephemeral: true,
        });
      });
  },
};
