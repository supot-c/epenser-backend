module.exports = (sequelize, datatypes) => 
  sequelize.define('wallet', {
    type: {
      type: datatypes.STRING,
      allowNull: false,
    },
    username: {
      type: datatypes.STRING,
      allowNull: false,
    },
    description: {
      type: datatypes.TEXT,
      defaultValue: '',
    },
    name: {
      type: datatypes.STRING,
      allowNull: false,
      defaultValue: 'Untitled',
    },
    click_count: {
      type: datatypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });
