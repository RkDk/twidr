async function generateUsers(n) {
  const faker = require('faker');
  const Knex = require('knex');
  const knexConfig = require('../knexfile');
  const knex = new Knex(knexConfig);
  try {
    const userIds = await knex('users').select('id').then(users => users.map(user => user.id));
    for (let i = 0; i < n; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const name = `${firstName} ${lastName}`;
      const handle = faker.internet.userName();
      const bio = faker.lorem.sentence();
      const profileImage = faker.internet.avatar();
      const createdAt = faker.date.past();

      const [imageId] =
        await knex('images')
          .insert({
            path: profileImage
          })
          .returning('id');

      const [userId] =
        await knex('users')
          .insert({
            name,
            handle,
            bio,
            createdAt,
            imageId
          })
          .returning('id');
      userIds.push(userId);

      for (let j = 0; j < userIds.length - 1; j++) {
        const target = userIds[j];
        await knex('userFollowers')
          .insert({
            followerId: target,
            followeeId: userId
          });
        await knex('userFollowers')
          .insert({
            followerId: userId,
            followeeId: target
          });
      }
    }
  } catch (err) {
    console.log(err);
  }
  knex.destroy();
}

const {argv} = process;
const arg = argv.length > 2 && argv[2].includes('number=') > -1 && +argv[2].split('number=')[1].trim();

if (isNaN(arg) || arg < 1) {
  console.log('A valid number of users (above 0) must be specified with `number` (ie. number=3)');
} else {
  generateUsers(arg);
}
