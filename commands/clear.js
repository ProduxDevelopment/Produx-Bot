const Discord = require("discord.js");
module.exports = {
  name: "clear",
  description: "Delete messages",
  args: true,
  aliases: ["purge", "prune"],
  permissions: ["Team"],
  usage: "[amount]",
  execute(client, message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Error!")
          .setDescription("Thats not a valid number.")
          .setColor("#FF0000")
      );
    } else if (amount <= 1 || amount > 100) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("Error!")
          .setDescription("you need to input a number between 1 and 99.")
          .setColor("#FF0000")
      );
    }

    message.channel
      .bulkDelete(amount, true)
      .then((messages) => {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`Deleted ${messages.size} messages`)
            .setColor("#0000FF")
        );
        message.guild.channels.cache
          .find((c) => c.name === "logs")
          .send({
            embed: {
              timestamp: new Date(),
              title: "Messages Bulk Deleted",
              fields: [
                {
                  name: "Amount:",
                  value: messages.size,
                },
                {
                  name: "Channel:",
                  value: message.channel,
                },
                {
                  name: "Moderator:",
                  value: `${message.author} (${message.author.id})`,
                },
              ],
            },
          });
      })
      .catch((err) => {
        client.logger.error(err);
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("Error!")
            .setDescription(
              "There was an error trying to clear messages in this channel!"
            )
            .setColor("#FF0000")
        );
      });
  },
};
