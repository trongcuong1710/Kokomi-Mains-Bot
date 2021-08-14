const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class RemoveWarnCommand extends Command {
  constructor() {
    super('removewarn', {
      aliases: ['removewarn', 'rw'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
        {
          id: 'warnID',
          type: 'string',
        },
      ],
      description: {
        description: "Remove a member's warn.",
        usage: 'removewarn <member> <warn ID>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
        })
      );
    if (!args.warnID)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a warnID.`,
        })
      );

    const permRoles = [
      '871201915206242324', // Owner
      '851648785351573565', // Admin
      '851651487586058313', // Mod
      '851884941423542324', // Trial Mods
      '830270184479522857', // Zyla
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    const warnReasonWas = await this.client.db.kokomiWarns.find({
      warnID: args.warnID,
    });
    await this.client.db.kokomiWarns
      .deleteOne({ warnID: args.warnID })
      .then(async (c) => {
        await message.channel.send(
          new MessageEmbed({
            color: 'GREEN',
            description: `Removed **${args.warnID}** from ${args.member.user.tag}'s warns.`,
          })
        );
        await this.client.channels.cache
          .get(channels.punishmentLogsChannel)
          .send(
            new MessageEmbed({
              color: 'RED',
              title: `Member Warn Removed`,
              description: `**Offender**: ${
                args.member.user.tag
              }\n**Responsible Staff**: ${
                message.author.tag
              }\n**Reason Was**: ${warnReasonWas
                .map((x) => x.reason)
                .join('\n')}`,
              footer: { text: `ID: ${args.member.id}` },
              timestamp: new Date(),
            })
          );
        args.member
          .send(
            new MessageEmbed({
              color: 'RED',
              title: `A warn has been removed you in ${global.guild.name}.`,
              description: `**Responsible Staff**: ${
                message.author.tag || message.author.username || message.author
              }\n**Reason was**: ${warnReasonWas
                .map((x) => x.reason)
                .join('\n')}`,
              timestamp: new Date(),
            })
          )
          .catch((_) => {
            return;
          });
      });
  }
}

module.exports = RemoveWarnCommand;
