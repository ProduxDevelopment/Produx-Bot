const fs = require("fs");
exports.warn = async (client, user, reason, mod) => {
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  if (!db[user.id]) db[user.id] = { warnings: [] };

  db[user.id].warnings.push({
    reason: reason,
    mod: mod.id,
  });

  fs.writeFileSync("db.json", JSON.stringify(db, null, 2), (err) => {
    if (err) console.error(err);
  });

  client.channels.cache
    .find((c) => c.name === "logs")
    .send({
      embeds: [
        {
          color: "FFFF00",
          timestamp: new Date(),
          title: "New Warning",
          fields: [
            {
              name: "Warnings:",
              value: db[user.id].warnings.length.toString(),
            },
            {
              name: "User:",
              value: `${user} (${user.id})`,
            },
            {
              name: "Reason:",
              value: reason || "None",
            },
            {
              name: "Moderator:",
              value: `${mod} (${mod.id})`,
            },
          ],
        },
      ],
    });

  user.send({
    embeds: [
      {
        color: "FFFF00",
        timestamp: new Date(),
        title: "You have been been Warned!",
        fields: [
          {
            name: "Warnings:",
            value: db[user.id].warnings.length.toString(),
          },
          {
            name: "Reason:",
            value: reason || "None",
          },
        ],
      },
    ],
  });
};
