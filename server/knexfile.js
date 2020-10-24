module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'postgres'
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
