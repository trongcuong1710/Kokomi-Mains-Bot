const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class IgnoreListCommand extends Command {
  constructor() {
    super('ignorelist', {
      aliases: ['ignorelist'],
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      description: {
        description: 'List ignored members.',
        usage: 'ignorelist',
      },
    });
  }

  async exec(message) {
    const ignoreList = await this.client.db.kokomiIgnoreList.find();

    if (!ignoreList.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'BLUE',
          description: `There are no ignored members in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'BLUE',
        title: `List of Ignored Members`,
        description: ignoreList
          .map(
            (x) =>
              `**Ignored Member:** ${x.member_id}\n**Ignored By**: ${message.author}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = IgnoreListCommand;
