const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiModmail',
  new mongoose.Schema({
    channel_id: String,
    member_id: String,
  }),
  'kokomiModmail'
);
