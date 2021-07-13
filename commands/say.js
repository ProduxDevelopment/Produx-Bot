module.exports = {
  name: "say",
  args: true,
  permissions: ["Team"],
  usage: "<normal/embed> <your text/embed code>",
  async execute(client, message, args) {
    if (args[0].toLowerCase() === "normal") {
      message.delete();
      return message.channel.send(args.slice(1).join(" "));
    }
    if (args[0].toLowerCase() === "embed") {
      try {
        JSON.parse(args.slice(1).join(" "));
      } catch (e) {
        return message.reply(
          "Something went wrong!\nPlease Generate your embed with https://embedbuilder.nadekobot.me/"
        );
      }
      message.delete();
      const embed = JSON.parse(args.slice(1).join(" "));
      return message.channel.send(embed.plainText, {
        embed: embed,
      });
    }
    return message.reply("Invalid Usage");
  },
};
