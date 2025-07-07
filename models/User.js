const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  skillsHave: {
    type: [String],
    default: []
  },
  skillsWant: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  interests: {
    type: [String],
    default: []
  },
  whyLearn: {
    type: String,
    trim: true,
    default: ''
  },
  whatTeach: {
    type: String,
    trim: true,
    default: ''
  },
  badges: {
    type: [String],
    default: []
  }
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
