module.exports = {
  name: "ping",
  description: "Pong!",
  async execute(client, message, args) {
    const msg = await message.channel.send("Pinging!");
    msg.edit(
      `🏓Latency is ${
        msg.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  },
};
