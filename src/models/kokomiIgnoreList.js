const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiIgnoreList',
  new mongoose.Schema({
    member_id: String,
    ignoredBy: String,
  }),
  'kokomiIgnoreList'
);
