module.exports = (sequelize, datatypes) =>
  sequelize.define('transaction', {
    receipt_id: {
      type: datatypes.INTEGER,
    },
    amount: {
      type: datatypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: datatypes.STRING,
      allowNull: true,
    },
    type: {
      type: datatypes.STRING,
      allowNull: false,
    }
  });
