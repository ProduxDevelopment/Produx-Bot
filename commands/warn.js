const Utils = require("../modules/Utils");
module.exports = {
  name: "warn",
  description: "Warn a user.",
  defaultPermission: false,
  options: [
    {
      name: "target",
      description: "User to warn",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Warn reason",
      type: "STRING",
    },
  ],
  async execute(interaction) {
    Utils.warn(
      interaction.client,
      interaction.options.getUser("target"),
      interaction.options.getString("reason"),
      interaction.user
    );
    interaction.reply({
      content: `You have successfully warned ${interaction.options.getUser(
        "target"
      )}.`,
      ephemeral: true,
    });
  },
};
