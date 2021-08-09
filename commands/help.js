module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  execute(interaction) {
    const data = [];
    const { commands } = interaction.client;
    commands.forEach((command) => {
      data.push({
        name: command.name,
        value: command.description,
      });
    });

    interaction.reply({
      embeds: [
        {
          title: "Commands:",
          fields: data,
        },
      ],
    });
  },
};
