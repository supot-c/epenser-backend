module.exports = (sequelize, datatypes) =>
  sequelize.define('item', {
    name: {
      type: datatypes.STRING,
    },
    type: {
      type: datatypes.STRING,
    },
    price: {
      type: datatypes.INTEGER,
    },
  });