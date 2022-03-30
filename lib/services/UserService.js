const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      username,
      passwordHash
    });
      
    return user;
  }
};
