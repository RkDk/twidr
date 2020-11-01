const express = require('express');
const Post = require('../models/Post');
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

router.post('/', async(request, response) => {
  const { activeUser, body } = request;
  const { id } = activeUser;
  const { content } = body;
  const post = await Post.query()
    .insertGraph({
      userId: id,
      content,
      metrics: {}
    })
    .modify('defaultSelects')
    .modify('aggregateUsers');
  console.log(post);
  response.status(200).json(post);
});

module.exports = router;
