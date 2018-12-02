const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const MedUsersSchema = new Schema({
  userName: {
    type: String,
    rquired: true,
  },
  passWord: {
    type: String,
    rquired: true,
  },
  avatar: {
    type: String,
  },
  identity: {
    type: String,
    rquired: true,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('med_users', MedUsersSchema);
