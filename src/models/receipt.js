module.exports = (sequelize, datatypes) =>
  sequelize.define('receipt', {
    wallet_id: {
      type: datatypes.INTEGER,
    },
    description: {
      type: datatypes.STRING,
      allowNull: true,
    },
    transdate: {
      type: datatypes.DATEONLY,
      allowNull: false,
    },
  });
