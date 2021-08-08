const fs = require("fs");
module.exports = {
  name: "ticket",
  description: "Creates a new ticket.",
  aliases: ["new"],
  usage: "[reason]",
  options: [
    {
      name: "reason",
      description: "Ticket Creation Reason",
      type: "STRING",
    },
  ],
  async execute(interaction) {
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
    const role = await interaction.guild.roles.cache.find(
      (role) => role.name === "Team"
    );
    interaction.guild.channels
      .create(`ticket-${counterName}`, {
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: role.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: interaction.client.user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
        type: "text",
        parent: await interaction.guild.channels.cache.find(
          (cat) => cat.name === "tickets"
        ),
        topic: `User: ${interaction.user.id} \nReason: ${
          interaction.options.getString("reason") || "None"
        }`,
      })
      .then(async (channel) => {
        interaction.reply({
          embeds: [
            {
              color: "6495ED",
              timestamp: new Date(),
              title: "🎫 New Ticket",
              description: `Your ticket has been created in ${channel}!\n**Reason:** ${
                interaction.options.getString("reason") || "None"
              }`,
            },
          ],
        });
        channel.send(`<@&${role.id}>`);
        channel.send(`<@${interaction.user.id}>`);
        channel.send({
          embeds: [
            {
              thumbnail: {
                url: interaction.client.user.displayAvatarURL({
                  dynamic: true,
                }),
              },
              color: "6495ED",
              timestamp: new Date(),
              title: `🎫 Ticket-${counterName}`,
              description: `Hello ${
                interaction.user
              }, Welcome to your ticket!\nPlease be patient and we will be with you shortly. If you would like to close this ticket please run \`/close\`\n\n**Reason:** \`${
                interaction.options.getString("reason") || "None"
              }\``,
            },
          ],
        });
        interaction.guild.channels.cache
          .find((c) => c.name === `logs`)
          .send({
            embeds: [
              {
                color: "6495ED",
                timestamp: new Date(),
                title: "🎫 New Ticket",
                fields: [
                  {
                    name: "User:",
                    value: `${interaction.user} (${interaction.user.id})`,
                  },
                  {
                    name: "Channel:",
                    value: `${channel} (${channel.id})`,
                  },
                  {
                    name: "Reason:",
                    value: interaction.options.getString("reason") || "None",
                  },
                ],
              },
            ],
          });
      });
  },
};
