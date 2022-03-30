const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/users', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      console.log(user);
      res.send(user);
    } catch (error) {
      next(error);   
    }
  });
