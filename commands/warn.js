module.exports = {
  name: "warn",
  args: true,
  permissions: ["Team"],
  usage: "<@user/user id> [reason]",
  async execute(client, message, args) {
    let user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    if (!user)
      return message.reply(
        "Invalid Usage\nProper Usage: `.warn <@user/user id> [reason]`"
      );
    await args.shift();
    client.utils.warn(client, user, args.join(" "), message.author);
    message.delete();
    message.channel.send({
      embed: {
        color: "00ff00",
        title: "User Warned!",
        description: `You have successfully warned ${user}.`,
      },
    });
  },
};
