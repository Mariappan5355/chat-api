module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_app'
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations/mysql'
      }
    }
  };
  