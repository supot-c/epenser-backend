const path = require('path');
require('dotenv').config();

module.exports = {
  port: process.env.PORT ,
  db: {
    // logging: process.env.seq_logging,
    database: process.env.db_database,
    user: process.env.db_user,
    password: process.env.db_password,
    options: {
      dialect: process.env.db_dialect,
      host: process.env.db_host,
      storage: process.env.db_storage,
      // logging: false,
      logging: console.log,
      dialectOptions: {
        socketPath: process.env.db_socketPath,
      },
    },
  },
  Authentication: {
    secret: 'KingCandy',
  }
};
