async function generateUsers(n) {
  const faker = require('faker');
  const Knex = require('knex');
  const knexConfig = require('../knexfile');
  const knex = new Knex(knexConfig);
  try {
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

      await knex('users')
        .insert({
          name,
          handle,
          bio,
          createdAt,
          imageId
        });
    }
  } catch (err) {
    console.log(err);
  }
  knex.destroy();
}

const { argv } = process;
const arg = argv.length > 2 && argv[2].includes('number=') > -1 && +argv[2].split('number=')[1].trim();

if (isNaN(arg) || arg < 1) {
  console.log('A valid number of users (above 0) must be specified with `number` (ie. number=3)');
} else {
  generateUsers(arg);
}
