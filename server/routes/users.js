const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async(request, response) => {
  const users = await User.query().modify('defaultSelects');
  response.status(200).json(users);
});

module.exports = router;
