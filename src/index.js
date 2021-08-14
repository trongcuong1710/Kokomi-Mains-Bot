const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');

require('dotenv').config();

const mongoose = require('mongoose');

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '488699894023061516',
      },
      {
        disableMentions: 'everyone',
        fetchAllMembers: true,
        partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
        presence: {
          activity: {
            name: `DM .ticket for help.`,
            type: 'PLAYING',
          },
          status: 'dnd',
          afk: false,
        },
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands',
      prefix: '.',
      automateCategories: true,
      allowMention: true,
      blockBots: true,
      blockClient: true,
    });
    this.commandHandler.handle = async function (message) {
      // if (message.author.id != this.client.ownerID) return;
      if (
        !(await this.client.db.kokomiBlacklists.findOne({
          channel_id: message.channel,
        }))
      )
        return CommandHandler.prototype.handle.call(this, message);
    };
    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners/',
      automateCategories: true,
    });
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    mongoose
      .connect(`${process.env.MONGOOSE_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('Connected to the database!'));

    this.db = {
      kokomiWarns: mongoose.model(
        'kokomiWarns',
        new mongoose.Schema({
          warnID: Number,
          warnedStaff: String,
          warnedMember: String,
          reason: String,
          when: Date,
        }),

        'kokomiWarns'
      ),
      kokomiQuotes: mongoose.model(
        'kokomiQuotes',
        new mongoose.Schema({
          quoteName: String,
          quote: String,
          by: String,
          embed: Boolean,
        }),
        'kokomiQuotes'
      ),
      kokomiBlacklists: mongoose.model(
        'kokomiBlacklists',
        new mongoose.Schema({
          channel_id: String,
          blacklistedBy: String,
        }),
        'kokomiBlacklists'
      ),
      kokomiIgnoreList: mongoose.model(
        'kokomiIgnoreList',
        new mongoose.Schema({
          member_id: String,
          ignoredBy: String,
        }),
        'kokomiIgnoreList'
      ),
      kokomiCustomRoles: mongoose.model(
        'kokomiCustomRoles',
        new mongoose.Schema({
          roleID: String,
          roleOwner: String,
        }),
        'kokomiCustomRoles'
      ),
      kokomiModmail: mongoose.model(
        'kokomiModmail',
        new mongoose.Schema({
          channel_id: String,
          member_id: String,
        }),
        'kokomiModmail'
      ),
      kokomiMutes: mongoose.model(
        'kokomiMutes',
        new mongoose.Schema({
          member_id: String,
          responsibleStaff: String,
          reason: String,
          unmuteDate: Number,
        }),
        'kokomiMutes'
      ),
    };
  }
}

const client = new MyClient();
client.login();
