const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.status(200).json({
    twids: [
      {
        id: 1,
        body: 'This is a test',
        userId: 1,
        timestamp: '1594866013579'
      },
      {
        id: 2,
        body: 'This is another test',
        userId: 1,
        timestamp: '1594866107457'
      }
    ]
  });
});

module.exports = router;
