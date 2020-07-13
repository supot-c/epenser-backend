const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');
const db = {};

// console.log(config.db);
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file !== 'relations.js')
  .forEach(file => {
    if (!process.env.seq_logging) console.log('*imported ', file);
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

require('./relations')(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
