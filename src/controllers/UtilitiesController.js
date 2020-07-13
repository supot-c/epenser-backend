const TransactionController = require('../controllers/TransactionController')
const config = require('../config/config');
const {createCanvas} = require('canvas');
const {saveAs } = require('file-saver');



module.exports = {
  flistatus(req, res) {
    var canvas = createCanvas(630, 1200);

    // getting the context will allow to manipulate the image
    var context = canvas.getContext("2d");

    context.fillStyle = "#D5DDF6";
    context.fillRect(0, 0, 1200, 630);
    context.fillStyle = "#E50611";
    context.font = "100px Arial";
    context.fillRect(20,220,50,50);
    context.fillText("Payment status", 50, 120);
    const value = canvas.toDataURL('image/png');

    res.send(value)

  },
};
