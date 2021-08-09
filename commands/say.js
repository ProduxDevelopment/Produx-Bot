module.exports = {
  name: "say",
  permissions: ["Team"],
  usage: "<normal/embed> <your text/embed code>",
  description: "Send a embed or normal message as the bot.",
  options: [
    {
      name: "normal",
      description: "Send plain text",
      type: "SUB_COMMAND",
      options: [
        {
          name: "message",
          description: "Plain Text to send",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "embed",
      description: "Send a embed",
      type: "SUB_COMMAND",
      options: [
        {
          name: "embed",
          description:
            "Generated Embed text from https://embedbuilder.nadekobot.me/",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "normal") {
      interaction.channel.send(interaction.options.getString("message"));
      return await interaction.reply({
        content: "Your message has been sent!",
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "embed") {
      return await interaction.reply({
        content: "This is currently unavailable.",
        ephemeral: true,
      });
      /*
      try {
        JSON.parse(interaction.options.getString("embed"));
      } catch (e) {
        return interaction.reply(
          "Something went wrong!\nPlease Generate your embed with https://embedbuilder.nadekobot.me/"
        );
      }
      const embed = JSON.parse(interaction.options.getString("embed"));
      return interaction.channel.send(embed.plainText, {
        embed: embed,
      });*/
    }
    return interaction.reply("Invalid Usage");
  },
};
