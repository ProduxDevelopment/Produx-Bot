const fs = require("fs");
module.exports = {
  name: "infractions",
  permissions: ["Team"],
  usage: "<@user/user id>",
  description: "View a user's infractions",
  options: [
    {
      name: "target",
      description: "User to check infractions of",
      type: "USER",
      required: true,
    },
  ],
  async execute(interaction) {
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const user = await interaction.options.getUser("target");
    if (!db[user.id])
      return interaction.reply("This user has no past infractions.");

    interaction.reply({
      embeds: [
        {
          title: `${user.tag}'s Infractions:`,
        },
        {
          color: "FFFF00",
          title: `${db[user.id].warnings.length} Warnings:`,
          description: db[user.id].warnings
            .map(
              (i) =>
                `**Reason:** ${i.reason || "None"}\n **Moderator:** <@${i.mod}>`
            )
            .join("\n\n"),
        },
      ],
    });
  },
};
