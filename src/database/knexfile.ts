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
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },
};

module.exports = dbConfig;

export default dbConfig;
