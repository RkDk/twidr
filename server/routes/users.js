const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.status(200).json({
    users: [
      {
        id: 1,
        name: 'Rick'
      },
      {
        id: 2,
        name: 'Other User'
      }
    ]
  });
});

module.exports = router;
