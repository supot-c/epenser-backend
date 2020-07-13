const {transaction} = require('../models');
const {receipt} = require('../models');
const model = require('../models');
const TransactionController = require('../controllers/TransactionController')
const axios = require('axios')
const config = require('../config/config');
const jwt = require('jsonwebtoken');

token = jwt.sign({"username": "candy", "email": "candy@candykingdom.com", "name": "Kingcandy II"}, config.Authentication.secret);

const AX =axios.create({
  baseURL: 'http://localhost:8888',
});

module.exports = {
  async create(req, res) {
    try {
      console.log('[elog]create receipt to"',req.body.wallet.name,'" :', req.body.receipt.description);
      const detail = {
        'wallet_id': req.body.wallet.id,
        "description": req.body.receipt.description,
        "transdate": req.body.receipt.transdate,
        "type": req.body.receipt.type,
        'storeId': req.body.receipt.storeId
      }
      const createdtran = await receipt.create(detail);
      res.send({receipt: createdtran});
    } catch (err) {
      res.status(400).send({
        message: 'Cannot create receipt. :' + err.message,
      });
    }
  },
  async index(req, res) {
    try {
      console.log('[elog]requst receipts in :', req.body.wallet.name);
      const {wallet} = req.body;

      model.wallet.update({
        click_count: wallet.click_count+1,
      },{
        where: {
          id: wallet.id
        }
      })

      const receipts = await receipt.findAll({
        where: {
          wallet_id: wallet.id,
        },
        order: [
          ['transdate', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      });
      res.send({ receipts });
    } catch (err) {
      console.log('[elog]*Failed loading receipts for:', err.message);
      res.status(400).send({
        message: 'Cannot get receipts.',
        err: err.message,
      });
    }
  },
  async del(req, res){
    var flag = false;
    try {
      const r = req.body;
      req.body.receipt = r;
      await receipt.destroy({
        where: {
          id: r.id
        }
      }).then(() => {
        res.send();
      });
    } catch (err) {
      console.log('[elog]*Failed deleting receipt :', err.message);
      if(!flag){
        falg = true;
        // this.del(req, res);
      }else{
        res.status(400).send({
          message: err.message,
        });
      }
    }
  }
};
