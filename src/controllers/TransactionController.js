const {transaction} = require('../models');
const {receipt} = require('../models');

module.exports = {
  async create(req, res) {
    try {
      console.log('[elog]create transaction to receipt no."',req.body.receipt.id,'" :', req.body.tran.description);
      const detail = {
        'receipt_id': req.body.receipt.id,
        "amount": req.body.tran.amount,
        "description": req.body.tran.description,
        "type": req.body.tran.type,
      }
      const createdtran = await transaction.create(detail);
      res.send(createdtran);
    } catch (err) {
      res.status(400).send({
        message: 'Cannot create transaction. :' + err.message,
      });
    }
  },
  async index(req, res) {
    try {
      console.log('[elog]requst transactions in receipt no:', req.body.receipt.id);
      const {receipt} = req.body;
      const transactions = await transaction.findAll({
        where: {
          receipt_id: receipt.id,
        },
        order: [
          ['createdAt', 'ASC'],
        ],
      });
      res.send({ transactions });
    } catch (err) {
      console.log('[elog]*Failed loading transactions :', err.message);
      res.status(400).send({
        message: 'Cannot get transactions.',
        err: err.message,
      });
    }
  },
  async del(req, res) {
    try {
      console.log('[elog]delete transaction no:', req.body.id);
      const tran = req.body;
      await transaction.destroy({
        where: {
          id: tran.id
        }
      })
      res.send();
    } catch (err) {
      console.log('[elog]*Failed deleting transactions for:', err.message);
      res.status(400).send({
        message: err.message,
      });
    }
  },
};
