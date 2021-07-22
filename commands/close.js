/* eslint-disable no-unused-vars */
const hastebin = require("hastebin-gen");
const { MessageEmbed } = require("discord.js");
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

module.exports = {
  name: "close",
  description: "Closes the ticket.",
  aliases: [],
  usage: "",
  async execute(client, message, args) {
    if (message.channel.name.includes("ticket-")) {
      const member = await message.guild.members.cache.get(
        message.channel.topic.trim().split(/ +/)[1]
      );
      const reason = await message.channel.topic
        .trim()
        .split(/ +/)
        .slice(3)
        .join(" ");
      let haste;
      message.channel.messages
        .fetch()
        .then(async (messages) => {
          const output = messages
            .array()
            .reverse()
            .map(
              (m) =>
                `${new Date(m.createdAt).toLocaleString("en-US")} - ${
                  m.author.tag
                }: ${
                  m.attachments.size > 0
                    ? m.attachments.first().proxyURL
                    : m.content
                }`
            )
            .join("\n");

          haste = await hastebin(output, { extension: "txt" });
          message.guild.channels.cache
            .find((c) => c.name === `transcripts`)
            .send({
              embed: {
                color: "6495ED",
                timestamp: new Date(),
                url: haste,
                title: `📄 ${message.channel.name.toProperCase()} Transcript`,
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
                    value: `${message.channel.name} (${message.channel.id})`,
                  },
                  {
                    name: "Transcript:",
                    value: haste,
                  },
                ],
              },
            });
          member.send({
            embed: {
              color: "6495ED",
              timestamp: new Date(),
              url: haste,
              title: `📄 ${message.channel.name.toProperCase()} Transcript`,
              description: `Here is a transcript of your ticket, please click the link above to view the transcript.`,
            },
          });
        })
        .then(() => {
          try {
            message.channel.delete().then(() => {
              message.guild.channels.cache
                .find((c) => c.name === `logs`)
                .send({
                  embed: {
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
                        value: `${message.channel.name} (${message.channel.id})`,
                      },
                      {
                        name: "Moderator:",
                        value: `${message.author} (${message.author.id})`,
                      },
                      {
                        name: "Transcript:",
                        value: haste,
                      },
                    ],
                  },
                });
            });
          } catch (e) {
            console.log(e);
          }
        });
    }
  },
};
