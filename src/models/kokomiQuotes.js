const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiQuotes',
  new mongoose.Schema(
    {
      quoteName: String,
      quote: String,
      by: String,
      embed: Boolean,
    },
    { typeKey: '$type' }
  ),
  'kokomiQuotes'
);
