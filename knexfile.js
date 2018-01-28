const parse = require('connection-string');
const _ = require('lodash');

require('dotenv').config();

const connection = parse(process.env.DATABASE_URL);

const defaults = {
  client: 'pg',
  connection: {
    user: connection.user || 'root',
    password: connection.password || '',
    host: connection.host,
    port: connection.port || 5432,
    database: connection.segments[0],
  },
  migrations: {
    directory: `${__dirname}/db/migrations`,
  },
  seeds: {
    directory: `${__dirname}/db/seeds`,
  },
  debug: false,
};

const environments = {
  production: {
    pool: {
      min: 2,
      max: 10,
    },
  },
};

const config = _.merge(defaults, environments[process.env.NODE_ENV]);

module.exports = config;
