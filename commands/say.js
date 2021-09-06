module.exports = {
  name: "say",
  description: "Send a embed or normal message as the bot.",
  defaultPermission: false,
  options: [
    {
      name: "normal",
      description: "Send plain text",
      type: "SUB_COMMAND",
      options: [
        {
          name: "message",
          description: "Plain Text to send",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "embed",
      description: "Send a basic embed",
      type: "SUB_COMMAND",
      options: [
        {
          name: "title",
          description: "Embed Title",
          type: "STRING",
          required: false,
        },
        {
          name: "description",
          description: "Embed Description",
          type: "STRING",
          required: false,
        },
      ],
    },
    {
      name: "advanced",
      description: "Send a advanced embed",
      type: "SUB_COMMAND",
      options: [
        {
          name: "embed",
          description:
            "Generated Embed text from https://robyul.chat/embed-creator",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "normal") {
      interaction.channel.send(interaction.options.getString("message"));
      return await interaction.reply({
        content: "Your message has been sent!",
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "embed") {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      if (!description && !title) {
        return await interaction.reply({
          content: "No embed content!",
          ephemeral: true,
        });
      }
      interaction.channel.send({
        embeds: [
          {
            title: title,
            description: description,
          },
        ],
      });
      return await interaction.reply({
        content: "Your message has been sent!",
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "advanced") {
      let embed = {
        author: {},
        footer: {},
        thumbnail: {},
        image: {},
        fields: [],
      };
      let text;
      try {
        interaction.options
          .getString("embed")
          .replace("_embed #channel", "")
          .split("|")
          .forEach((property) => {
            property = property.trim();

            let key = property.substring(0, property.indexOf("=")).trim();
            let value = property.substring(property.indexOf("=") + 1).trim();

            if (key == "author") {
              let startOfName =
                value.indexOf("name=") == -1
                  ? undefined
                  : value.indexOf("name=");
              let startOfIcon =
                value.indexOf("icon=") == -1
                  ? undefined
                  : value.indexOf("icon=");
              let startOfURL =
                value.indexOf("url=") == -1 ? undefined : value.indexOf("url=");

              let name =
                typeof startOfName == "number"
                  ? value
                      .substring(startOfName + 5, startOfIcon || startOfURL)
                      .trim()
                  : undefined;
              let icon =
                typeof startOfIcon == "number"
                  ? value.substring(startOfIcon + 5, startOfURL).trim()
                  : undefined;
              let url =
                typeof startOfURL == "number"
                  ? value.substring(startOfURL + 4).trim()
                  : undefined;

              if (icon == "me")
                icon = interaction.user.displayAvatarURL({ dynamic: true });
              if (icon == "bot")
                icon = interaction.client.user.displayAvatarURL({
                  dynamic: true,
                });
              if (url == "me")
                url = interaction.user.displayAvatarURL({ dynamic: true });
              if (url == "bot")
                url = interaction.client.user.displayAvatarURL({
                  dynamic: true,
                });

              embed.author.name = name;
              embed.author.iconURL = icon;
              embed.author.url = url;
            } else if (key == "thumbnail") {
              if (value == "me")
                value = interaction.user.displayAvatarURL({ dynamic: true });
              if (value == "bot")
                value = interaction.client.user.displayAvatarURL({
                  dynamic: true,
                });

              embed.thumbnail.url = value;
            } else if (key == "image") {
              if (value == "me")
                value = interaction.user.displayAvatarURL({ dynamic: true });
              if (value == "bot")
                value = interaction.client.user.displayAvatarURL({
                  dynamic: true,
                });

              embed.image.url = value;
            } else if (key == "footer") {
              let startOfName =
                value.indexOf("name=") == -1
                  ? undefined
                  : value.indexOf("name=");
              let startOfIcon =
                value.indexOf("icon=") == -1
                  ? undefined
                  : value.indexOf("icon=");

              if (startOfName == undefined) return (embed.footer.text = value);

              let name =
                typeof startOfName == "number"
                  ? value.substring(startOfName + 5, startOfIcon).trim()
                  : undefined;
              let icon =
                typeof startOfIcon == "number"
                  ? value.substring(startOfIcon + 5).trim()
                  : undefined;

              if (icon == "me")
                icon = interaction.user.displayAvatarURL({ dynamic: true });
              if (icon == "bot")
                icon = interaction.client.user.displayAvatarURL({
                  dynamic: true,
                });

              embed.footer.text = name;
              embed.footer.iconURL = icon;
            } else if (key == "color") {
              embed[key] = parseInt(value.replace("#", ""), 16);
            } else if (key == "field") {
              let startOfName =
                value.indexOf("name=") == -1
                  ? undefined
                  : value.indexOf("name=");
              let startOfValue =
                value.indexOf("value=") == -1
                  ? undefined
                  : value.indexOf("value=");
              let startOfInline = value.indexOf("inline=");

              let name =
                typeof startOfName == "number"
                  ? value.substring(startOfName + 5, startOfValue).trim()
                  : undefined;
              let v =
                typeof startOfValue == "number"
                  ? value
                      .substring(
                        startOfValue + 6,
                        startOfInline == -1 ? undefined : startOfInline
                      )
                      .trim()
                  : undefined;
              let inline =
                startOfInline == -1
                  ? true
                  : value.substring(startOfInline + 7).trim();

              if (typeof inline == "string")
                inline = inline == "false" || inline == "no" ? false : true;

              if (!name) name = "\u200b";
              if (!v) v = "\u200b";

              embed.fields.push({ name, value: v, inline });
            } else if (key == "ptext") {
              text = value;
            } else embed[key] = value;
          });
      } catch (e) {
        return interaction.reply(
          "Something went wrong!\nPlease Generate your embed with https://embedbuilder.nadekobot.me/"
        );
      }
      await interaction.channel.send({ content: text, embeds: [embed] });
      return await interaction.reply({
        content: "Your message has been sent!",
        ephemeral: true,
      });
    }
    return interaction.reply("Invalid Usage");
  },
};
