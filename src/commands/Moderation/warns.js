const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class WarnsCommand extends Command {
  constructor() {
    super('warns', {
      aliases: ['warns'],
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
        description: 'Shows list of warnings of a member.',
        usage: 'warns <member> / warns <member> <warn ID>',
      },
    });
  }
  async showMemberWarnings(message, args, prefix, warns) {
    return await message.channel.send(
      new Discord.MessageEmbed({
        color: 'GREEN',
        description: warns.map((x) => `Warn ID: ${x.warnID}`).join('\n'),
        fields: [
          {
            name: 'View',
            value: `${prefix}warns ${args.member} <warnID>`,
            inline: true,
          },
          {
            name: 'Remove',
            value: `${prefix}removewarn ${args.member} <warnID>`,
            inline: true,
          },
        ],
      })
    );
  }
  async showWarnOfID(message, args) {
    await this.client.db.kokomiWarns
      .find({
        warnID: args.warnID,
      })
      .then(async (w) => {
        return await message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `.removewarn ${args.member} ${w.map(
              (x) => x.warnID
            )} to remove a warning.\n\n**Warn ID**: ${w.map(
              (x) => x.warnID
            )}\n**Responsible Staff**: ${w.map(
              (x) => x.warnedStaff
            )}\n**Reason**: ${w
              .map((x) => x.reason)
              .join('\n')}\n**Date**: ${w.map((x) =>
              moment(x.when).format('LLLL')
            )}`,
            fields: [
              {
                name: `Remove`,
                value: `${this.client.commandHandler.prefix}removewarn ${
                  args.member
                } ${w.map((x) => x.warnID)}`,
                inline: true,
              },
            ],
          })
        );
      });
  }

  async exec(message, args) {
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
    const prefix = this.client.commandHandler.prefix;

    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
        })
      );
    const warns = await this.client.db.kokomiWarns.find({
      warnedMember: args.member,
    });
    if (!warns.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} has no warnings, yet.`,
        })
      );

    if (!args.warnID)
      return await this.showMemberWarnings(message, args, prefix, warns);

    await this.showWarnOfID(message, args);
  }
}

module.exports = WarnsCommand;
