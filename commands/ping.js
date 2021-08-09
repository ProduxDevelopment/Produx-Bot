module.exports = {
  name: "ping",
  description: "Pong!",
  async execute(interaction) {
    await interaction.reply(
      `🏓 API Latency is ${Math.round(interaction.client.ws.ping)}ms`
    );
  },
};
