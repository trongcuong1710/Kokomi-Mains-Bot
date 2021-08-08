const mongoose = require('mongoose');

module.exports = mongoose.model(
  'kokomiCustomRoles',
  new mongoose.Schema({
    roleID: String,
    roleOwner: String,
  }),
  'kokomiCustomRoles'
);
