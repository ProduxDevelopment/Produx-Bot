const fs = require("fs");
module.exports = {
  name: "ticket",
  description: "Creates a new ticket.",
  aliases: ["new"],
  usage: "[reason]",
  async execute(client, message, args, prefix) {
    if (
      message.guild.channels.cache.find(
        (channel) => channel.name === `ticket-${message.author.id}`
      )
    ) {
      return message.reply(
        "you already have a ticket, please close your existing ticket first before opening a new one!"
      );
    }
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    if (!db.tickets) db.tickets = { count: 0 };

    db.tickets.count = (await db.tickets.count) + 1;

    fs.writeFileSync("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) console.error(err);
    });

    let counter = await db.tickets.count;
    let counterName;

    if (counter <= 9) {
      counterName = `000${counter}`;
    } else if (counter <= 99) {
      counterName = `00${counter}`;
    } else if (counter <= 999) {
      counterName = `0${counter}`;
    } else {
      counterName = `${counter}`;
    }
    const role = await message.guild.roles.cache.find(
      (role) => role.name === "Team"
    );
    message.guild.channels
      .create(`ticket-${counterName}`, {
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: role.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: client.user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
        type: "text",
        parent: await message.guild.channels.cache.find(
          (cat) => cat.name === "tickets"
        ),
        topic: `User: ${message.author.id} \nReason: ${args.join(" ")}`,
      })
      .then(async (channel) => {
        message.channel.send({
          embed: {
            color: "6495ED",
            timestamp: new Date(),
            title: "🎫 New Ticket",
            description: `Your ticket has been created in ${channel}!\n**Reason:** ${
              args.join(" ") || "None"
            }`,
          },
        });
        channel.send(`<@&${role.id}>`);
        channel.send(`<@${message.author.id}>`);
        channel.send({
          embed: {
            thumbnail: {
              url: client.user.displayAvatarURL({ dynamic: true }),
            },
            color: "6495ED",
            timestamp: new Date(),
            title: `🎫 Ticket-${counterName}`,
            description: `Hello ${
              message.author
            }, Welcome to your ticket!\nPlease be patient and we will be with you shortly. If you would like to close this ticket please run \`${
              process.env.PREFIX
            }close\`\n\n**Reason:** \`${args.join(" ") || "None"}\``,
          },
        });
        message.guild.channels.cache
          .find((c) => c.name === `logs`)
          .send({
            embed: {
              color: "6495ED",
              timestamp: new Date(),
              title: "🎫 New Ticket",
              fields: [
                {
                  name: "User:",
                  value: `${message.author} (${message.author.id})`,
                },
                {
                  name: "Channel:",
                  value: `${channel} (${channel.id})`,
                },
                {
                  name: "Reason:",
                  value: args.join(" ") || "None",
                },
              ],
            },
          });
      });
  },
};
