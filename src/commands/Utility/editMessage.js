const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EditMessageCommand extends Command {
  constructor() {
    super('editmessage', {
      aliases: ['editmessage', 'em'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'messageID',
          type: 'guildMessage',
          match: 'phrase',
        },
        {
          id: 'newMessage',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Edits a message.',
        usage: 'editmessage <messageID> <new message>',
      },
    });
  }

  async exec(message, args) {
    const permRoles = [
      '871201915206242324', // Owner
      '851648785351573565', // Admin
      '851651487586058313', // Mod
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
          new MessageEmbed().setDescription(
            "You can't do that with the permissions you have."
          )
        );
    }

    if (!args.messageID)
      return message.channel.send(
        new MessageEmbed({
          description: `I can't find the message.`,
        })
      );
    if (!args.newMessage)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a message to replace the old one.`,
        })
      );

    if (args.messageID.partial) {
      await args.messageID
        .fetch()
        .then(async (fullMessage) => {
          await fullMessage.edit(args.newMessage).then(async () => {
            message.react('875014901515583518');
          });
        })
        .catch((error) => {
          message.channel.send(
            'Something went wrong when fetching the message: ',
            error
          );
        });
    } else {
      await args.messageID.edit(args.newMessage).then(async () => {
        message.react('875014901515583518');
      });
    }
  }
}

module.exports = EditMessageCommand;
