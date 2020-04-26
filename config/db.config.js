const dotenv = require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: process.env.DB,
    logging: false,
    options: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialectOption: {
        ssl: true,
        native: true
      },
    }

  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialect: process.env.DB,
    options: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialectOptions: {
        options: {
          instanceName: '',
          encrypt: true,
        }
      }

    }
  }
};
