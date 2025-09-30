require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DATABASE_URL,
  NODE_ENV,
} = process.env;

const resolveLogging = () => {
  if (process.env.DB_LOGGING === 'true') return console.log;
  if (process.env.DB_LOGGING === 'false') return false;
  return NODE_ENV === 'development' ? console.log : false;
};

const baseDatabaseName = DB_NAME || 'foodies_db';

const common = {
  username: DB_USER || 'postgres',
  password: DB_PASSWORD || 'postgres',
  database: baseDatabaseName,
  host: DB_HOST || '127.0.0.1',
  port: DB_PORT ? Number(DB_PORT) : undefined,
  dialect: process.env.DB_DIALECT || 'postgres',
  storage: process.env.DB_STORAGE,
  logging: resolveLogging(),
  define: {
    underscored: true,
    freezeTableName: false,
    paranoid: false,
  },
  dialectOptions: {
    useUTC: false,
  },
  timezone: '+00:00',
};

const withSqliteAdjustments = (config) => {
  if (config.dialect !== 'sqlite') return config;

  return {
    ...config,
    username: undefined,
    password: undefined,
    host: undefined,
    port: undefined,
    storage: config.storage || ':memory:',
  };
};

module.exports = {
  development: withSqliteAdjustments({
    ...common,
    url: DATABASE_URL,
  }),
  test: withSqliteAdjustments({
    ...common,
    database: process.env.DB_NAME_TEST || `${baseDatabaseName}_test`,
    logging: false,
  }),
  production: withSqliteAdjustments({
    ...common,
    url: DATABASE_URL,
    dialectOptions: {
      ...common.dialectOptions,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
};
