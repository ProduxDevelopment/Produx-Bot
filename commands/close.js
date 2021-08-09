const hastebin = require("hastebin-gen");
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

module.exports = {
  name: "close",
  description: "Closes the ticket.",
  options: [
    {
      name: "reason",
      description: "Ticket Close Reason",
      type: "STRING",
    },
  ],
  async execute(interaction) {
    if (interaction.channel.name.includes("ticket-")) {
      const member = await interaction.guild.members.cache.get(
        interaction.channel.topic.trim().split(/ +/)[1]
      );
      const reason = await interaction.channel.topic
        .trim()
        .split(/ +/)
        .slice(3)
        .join(" ");
      let haste;
      interaction.channel.messages
        .fetch()
        .then(async (messages) => {
          const output = Array.from(messages)
            .reverse()
            .map(
              (m) =>
                `${new Date(m[1].createdAt).toLocaleString("en-US")} - ${
                  m[1].author.tag
                }: ${
                  m[1].attachments.size > 0
                    ? m[1].attachments.first().proxyURL
                    : m[1].content
                }`
            )
            .join("\n");
          haste = await hastebin(output || "No messages found!", {
            extension: "txt",
          });
          interaction.guild.channels.cache
            .find((c) => c.name === `transcripts`)
            .send({
              embeds: [
                {
                  color: "6495ED",
                  timestamp: new Date(),
                  url: haste,
                  title: `📄 ${interaction.channel.name.toProperCase()} Transcript`,
                  fields: [
                    {
                      name: "User:",
                      value: `${member} (${member.id})`,
                    },
                    {
                      name: "Reason:",
                      value: reason,
                    },
                    {
                      name: "Channel:",
                      value: `${interaction.channel.name} (${interaction.channel.id})`,
                    },
                    {
                      name: "Transcript:",
                      value: haste,
                    },
                  ],
                },
              ],
            });
          member.send({
            embeds: [
              {
                color: "6495ED",
                timestamp: new Date(),
                url: haste,
                title: `📄 ${interaction.channel.name.toProperCase()} Transcript`,
                description: `Here is a transcript of your ticket, please click the link above to view the transcript.`,
              },
            ],
          });
        })
        .then(() => {
          try {
            channelCopy = interaction.channel;
            interaction.channel.delete().then(() => {
              interaction.guild.channels.cache
                .find((c) => c.name === `logs`)
                .send({
                  embeds: [
                    {
                      color: "FF0000",
                      timestamp: new Date(),
                      title: "❌ Ticket Closed",
                      fields: [
                        {
                          name: "User:",
                          value: `${member} (${member.id})`,
                        },
                        {
                          name: "Channel:",
                          value: `${channelCopy.name} (${channelCopy.id})`,
                        },
                        {
                          name: "Moderator:",
                          value: `${interaction.user} (${interaction.user.id})`,
                        },
                        {
                          name: "Reason:",
                          value:
                            interaction.options.getString("reason") || "None",
                        },
                        {
                          name: "Transcript:",
                          value: haste,
                        },
                      ],
                    },
                  ],
                });
            });
          } catch (e) {
            console.error(e);
          }
        });
    }
  },
};
