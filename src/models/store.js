module.exports = (sequelize, datatypes) =>
  sequelize.define('store', {
    name: {
      type: datatypes.STRING,
    },
    description: {
      type: datatypes.STRING,
    },
    type: {
      type: datatypes.STRING,
    },
    pic: {
      type: datatypes.TEXT,
    },
  });