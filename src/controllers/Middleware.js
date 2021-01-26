const jwt = require('jsonwebtoken');
const config = require('../config/config')

module.exports = {
  verify_token (req, res, next) {
  const bheader = req.headers['authorization'];
    if (!bheader) {
      res.status(403).send({mesage: 'No autherntication type provided.'});
    }
    
    const [type, token] = bheader.split(' ');
    if (type !== 'Bearer') {
      res
        .status(403)
        .send({message: 'Wrong authentication token type provided.'});
    }

    try {
      const data = jwt.verify(token, config.Authentication.secret);
      req.token = token;
      req.user = data;
      if (req.body.user) {
        console.log('\n[elog]token verified[r].', req.body.user.username)
      } else {
        console.log('\n[elog]token verified[t].',data.username)
      }

      const task = req.headers['task'];
      if(data.task || task){
        if(task == data.task){
          next()
        }
        else{
          res.status(403).send({error: 'Permission denied.'})
        }
      }else{
        next()
      }
    } catch (err) {
      res.status(403).send({error: err.message});
    }
  },

  isAdmin (req, res, next) {
    if (req.user.username == 'candy'){
      next()
    }
    else{
      res.status(403).send({error: 'Permission denied.'})
    }
  }
}
