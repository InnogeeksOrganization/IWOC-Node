const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    required: true
  }
})
module.exports = mongoose.model('Admins',AdminSchema)