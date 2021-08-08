const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiWarns',
  new mongoose.Schema({
    warnID: Number,
    warnedMember: String,
    warnedStaff: String,
    reason: String,
    when: Date,
  }),
  'kokomiWarns'
);
