const {store} = require('../models');

module.exports = {
  async create(req, res) {
    await store.create({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      pic: req.body.pic,
      owner: req.user.username
    })
    .then(out => {
      console.log('[elog]store created for :', req.user.username ,'('+req.body.name+')');
      res.send(out);
    })
  },

  async index(req, res) {
    // res.send(req.body);
    await store.findAll({
      where: {
        owner: req.user.username
      }
    })
    .then(stores => {
      res.send(stores);
    })
  }
}
