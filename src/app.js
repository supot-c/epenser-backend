'use strict';

const express = require('express');
const {sequelize} = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, world!')
    .end();
});

require('./routes')(app);

sequelize.sync({force: false });

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  if (process.env.seq_logging) {
    console.log(`App listening on port ${PORT}`);
  }
  console.log('*Server restarted.');
});
// [END gae_node_request_example]

module.exports = app;
