import type { Knex } from 'knex';

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      ssl: false,
      port: 5432,
      user: 'root',
      password: 'example',
      database: 'seetickets',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

module.exports = dbConfig;

export default dbConfig;
