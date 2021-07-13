const fs = require("fs");
module.exports = {
  name: "infractions",
  args: true,
  permissions: ["Team"],
  usage: "<@user/user id>",
  async execute(client, message, args) {
    let user =
      message.mentions.users.first() || (await client.users.cache.get(args[0]));
    if (!user)
      return message.reply(
        "Invalid Usage\nProper Usage: `.infractions <@user/user id>`"
      );
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    if (!db[user.id])
      return message.reply("This user has no past infractions.");

    message.channel.send({
      embed: {
        title: `${user.tag}'s Infractions:`,
      },
    });
    if (db[user.id].warnings) {
      message.channel.send({
        embed: {
          color: "FFFF00",
          title: `${db[user.id].warnings.length} Warnings:`,
          description: db[user.id].warnings
            .map(
              (i) =>
                `**Reason:** ${i.reason || "None"}\n **Moderator:** <@${i.mod}>`
            )
            .join("\n\n"),
        },
      });
    }
  },
};
