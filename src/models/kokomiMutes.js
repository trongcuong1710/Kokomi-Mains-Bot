const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiMutes',
  new mongoose.Schema({
    member_id: String,
    responsibleStaff: String,
    reason: String,
    unmuteDate: Number,
  }),
  'kokomiMutes'
);
