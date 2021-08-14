const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiBlacklists',
  new mongoose.Schema({
    channel_id: String,
    blacklistedBy: String,
  }),
  'kokomiBlacklists'
);
