const mongoose = require('mongoose');

// role management
const roles = ["user", "admin"];

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: roles,
    default: "user"
  },
  imageUrl: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


module.exports = mongoose.model('User', userSchema);