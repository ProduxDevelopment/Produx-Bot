module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    client.logger.cmd(
      `[CMD] ${interaction.user.username} (${interaction.user.id}) ran command ${command.name}`
    );
    await command.execute(interaction);
  } catch (error) {
    client.logger.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};
