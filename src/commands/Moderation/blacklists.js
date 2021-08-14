const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistsCommand extends Command {
  constructor() {
    super('blacklists', {
      aliases: ['blacklists', 'blist'],
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      description: {
        description: 'List blacklisted channels.',
        usage: 'blacklists',
      },
    });
  }

  async exec(message, args) {
    const blacklists = await this.client.db.kokomiBlacklists.find();
    if (!blacklists.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'BLUE',
          description: `There are no blacklisted channels in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'BLUE',
        title: `Blacklisted Channels`,
        description: blacklists
          .map(
            (x) =>
              `**Blacklisted Channel:** ${x.channel_id}\n**Blacklisted By:** ${x.blacklistedBy}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = BlacklistsCommand;
