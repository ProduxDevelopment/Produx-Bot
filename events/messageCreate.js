const Discord = require("discord.js");
module.exports = async (client, message) => {
  const Filter = require("bad-words"),
    filter = new Filter();

  if (
    filter.isProfane(message.content) &&
    !message.member.roles.cache.some((r) =>
      ["Team", "Board", "Executive", "Development"].includes(r.name)
    )
  ) {
    message.delete();
    message.guild.channels.cache
      .find((c) => c.name === "logs")
      .send({
        embed: {
          color: "ADD8E6",
          timestamp: new Date(),
          title: "Smart Word Detection",
          fields: [
            {
              name: "User:",
              value: `${message.author} (${message.author.id})`,
            },
            {
              name: "Message:",
              value: message.content,
            },
          ],
        },
      });
    client.utils.warn(
      client,
      message.author,
      "Smart Word Detection",
      client.user
    );
  }

  if (
    message.content.toLowerCase().includes("discord.gg") ||
    message.content.toLowerCase().includes("discord.com/invite")
  ) {
    if (
      !message.member.roles.cache.some((r) =>
        ["Team", "Board", "Executive", "Development"].includes(r.name)
      )
    ) {
      message.delete();
      message.guild.channels.cache
        .find((c) => c.name === "logs")
        .send({
          embed: {
            color: "ADD8E6",
            timestamp: new Date(),
            title: "Smart Link Detection",
            fields: [
              {
                name: "User:",
                value: `${message.author} (${message.author.id})`,
              },
              {
                name: "Message:",
                value: message.content,
              },
            ],
          },
        });
      client.utils.warn(
        client,
        message.author,
        "Smart Link Detection",
        client.user
      );
    }
  }
}