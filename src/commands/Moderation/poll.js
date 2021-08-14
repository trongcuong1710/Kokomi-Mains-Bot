const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PollCommand extends Command {
  constructor() {
    super('poll', {
      aliases: ['poll'],
      description: { description: 'Create a poll.', usage: 'poll <question>' },
      ownerOnly: false,
      category: 'Moderation',
      args: [{ id: 'question', type: 'string', match: 'rest' }],
    });
  }

  async exec(message, args) {
    if (!args.question)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Poll for what?`,
        })
      );

    message.delete();

    message.channel
      .send(
        new MessageEmbed({
          description: `**${message.author.username}** asks:\n${args.question}`,
        })
      )
      .then(async (m) => {
        await m.react('864925053501440041');
        await m.react('864922724693311498');
      });
  }
}

module.exports = PollCommand;
