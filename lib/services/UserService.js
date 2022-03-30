const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      email,
      passwordHash
    });
    return user;
  }

  static async signin({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('invalid username/password');

    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid username/password');

    return user;
  }
};
