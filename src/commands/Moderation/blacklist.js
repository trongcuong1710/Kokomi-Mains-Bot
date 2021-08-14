const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BlacklistCommand extends Command {
  constructor() {
    super('blacklist', {
      aliases: ['blacklist'],
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [
        {
          id: 'channel',
          type: (message, phrase) => {
            return this.client.util.resolveChannel(
              phrase,
              message.guild.channels.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Disables/Enables kokomi in a given channel.',
        usage: 'blacklist <channel>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');

    if (!args.channel)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please specify a channel.`,
        })
      );

    if (
      !(await this.client.db.kokomiBlacklists.findOne({
        channel_id: args.channel,
      }))
    ) {
      await this.client.db.kokomiBlacklists
        .create({
          channel_id: args.channel,
          blacklistedBy: message.author,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is now blacklisted.`,
              footer: { text: `Use the command again to unblacklist.` },
            })
          );
          this.client.channels.cache.get(channels.punishmentLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Channel Blacklist`,
              description: `**Channel**: ${args.channel}\n**Responsible Staff**: ${message.author.tag}`,
              footer: { text: `Channel ID: ${args.channel.id}` },
              timestamp: new Date(),
            })
          );
        });
    } else
      return await this.client.db.kokomiBlacklists
        .findOneAndRemove({
          channel_id: args.channel,
        })
        .then(async () => {
          await message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is not blacklisted anymore.`,
              footer: { text: `Use the command again to blacklist.` },
            })
          );
          return await this.client.channels.cache
            .get(channels.punishmentLogsChannel)
            .send(
              new Discord.MessageEmbed({
                color: 'RED',
                title: `Channel Unblacklist`,
                description: `**Channel**: ${args.channel}\n**Responsible Staff**: ${message.author.tag}`,
                footer: { text: `Channel ID: ${args.channel.id}` },
                timestamp: new Date(),
              })
            );
        });
  }
}

module.exports = BlacklistCommand;
