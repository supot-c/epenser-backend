module.exports = (sequelize, datatypes) =>
  sequelize.define('user', {
    email: {
      type: datatypes.STRING,
      unique: true,
    },
    password: {
      type: datatypes.STRING,
    },
    username: {
      type: datatypes.STRING,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: datatypes.STRING,
    },
  });
