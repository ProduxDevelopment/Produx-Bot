module.exports = {
  name: "ping",
  description: "Pong!",
  async execute(interaction) {
    await interaction.reply("Pong!");
    /*
    const msg = await interaction.reply("Pinging!");
    msg.edit(
      `🏓Latency is ${
        msg.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
    */
  },
};
