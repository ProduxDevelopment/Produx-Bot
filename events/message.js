module.exports = {
  name: "message",
  execute(message, client) {
    if (
      !message.content.startsWith(process.env.PREFIX) ||
      message.author.bot ||
      message.channel.type === "dm"
    )
      return;

    const args = message.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.permissions) {
      if (
        !message.member.roles.cache.some((r) =>
          command.permissions.includes(r.name)
        )
      ) {
        return message.reply("You don't have permission to do this!");
      }
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
      }

      return message.reply(reply);
    }

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  },
};
