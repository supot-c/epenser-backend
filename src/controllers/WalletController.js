const axios = require('axios')
const model = require('../models');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const AX = axios.create({
  baseURL: 'http://localhost:'+ process.env.PORT,
});


module.exports = {
  async create(req, res) {
    try {
      // console.log(req.body)
      console.log('create wallet :', req.body.username);
      const createdwallet = await model.wallet.create(req.body);

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      console.log(req.token);
      
      mastertoken = jwt.sign({"username": req.body.username, "email": req.body.email, "name": req.body.name}, config.Authentication.secret)
      const stores = await AX.get('/store', { headers: { Authorization: 'Bearer ' + req.token } })
      
      const creceipt = await AX.post('/wallet/transaction/createReceipt', {wallet: createdwallet, receipt: {transdate: today, storeId: stores.data[0].id}}, { headers: { Authorization: 'Bearer ' + mastertoken } })
      await AX.post('/wallet/transaction/create', {receipt: {id: creceipt.data.receipt.id}, tran: {description: 'Initial amount', amount: req.body.amount, type: 'income'}} ,{ headers: { Authorization: 'Bearer ' + mastertoken } } )

      res.send(createdwallet);
    } catch (err) {
      // console.log(err)
      res.status(400).send({
        message: 'Cannot create wallet.',
        err: err.message,
      });
    }
  },
  async update(req, res){
    try{
      console.log('[elog]update wallet :', req.body.username);
      const updated = await model.wallet.update({
        type: req.body.type,
        description: req.body.description,
        name: req.body.name
      },{
        where: {
          id: req.body.id
        }
      })
      res.send({msg: 'finished'})
    } catch(err) {
      res.status(400).send({msg: err.message})
    }
  },
  async index(req, res) {
    try {
      // console.log('requst wallets:', req.body.user.username);
      // var {user} = req.body;
      // console.log(req.user);
      // if (!user) {
        // console.log(req.user);
        // user = req.user;
      // }
      const targetwallet = await model.wallet.findAll({
        where: {
          // username: user.username,
          username: req.user.username,
        },
        order: [
          ['click_count', 'DESC'],
        ],
      });

      for(const wallet of targetwallet){
        wallet.dataValues.receipts = await model.receipt.findAll({
          where: {
            wallet_id: wallet.id,
          },
        });
        wallet.dataValues.amount = 0;
      }

      for(const wallet of targetwallet){
        for(const receipt of wallet.dataValues.receipts){
          await model['transaction'].sum('amount', {where: {type: 'income', receipt_id: receipt.id}}).then(res => {
            wallet.dataValues.amount += res;
          })
          await model['transaction'].sum('amount', {where: {type: 'expense', receipt_id: receipt.id}}).then(res => {
            wallet.dataValues.amount -= res;
          })
        }
      }
      
      res.send({data: targetwallet});
    } catch (err) {
      console.log('[elog]*Failed loading wallets for:', err.message);
      res.status(400).send({
        message: 'No user data pervided.',
      });
    }
  },
};
