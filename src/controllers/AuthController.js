const {user} = require('../models');
const tool = require('../tools/AuthTool');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios')
const nodemailer = require('nodemailer')

// eslint-disable-next-line func-style
function signUser(user, expire=process.env.token_epire_period) {
  return jwt.sign(user, config.Authentication.secret, {
    expiresIn: expire,
  });
}

const AX = axios.create({
  baseURL: 'http://localhost:'+ process.env.PORT,
});


module.exports = {
  ota(req, res) {
    res.send({
      mesage: 'avilable',
    });
  },
  async verify(req, res){//this function is exclusivly use for reset password process
    try {
      const token = req.body.token
      const data = jwt.verify(String(token), config.Authentication.secret);
      await user.findOne({
        where: {
          email: data.email
        }
      }).then(user => {
        console.log('[elog]reset password token verified :', user.username);
        res.send({
          email: data.email,
          username: user.username
        })
      })
      // res.send(data)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  async reset_password(req, res){
    await user.update({
      password: req.body.password,
    },{
      where: {
        username: req.body.username,
      }
    }).then(updated => {
      console.log('[elog]password is reset for :', req.body.username);
      res.send({msg: 'password reset complete'})
    }).catch(error => {
      console.log('[elog]error reset password :', req.body.username, error);
      res.status(400).send({err: error})
    })
    
  },
  async forget_password(req, res){
    const users = await user.findAll({
      where: {
        email: req.body.email,
      }
    });
    //create session token
    
    
    const token = signUser(
      {email: req.body.email, task: 'reset_password'},300//password reset token expired in 5 minutes
    )

    if(users.length == 0){
      res.status(200).send({err: 'email does not not exist.'})
    }
    else{
      console.log('[elog]password reset email request for :', user[0]);
      try {
        // console.log(req.body.email);
        
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: 'epenser.service@gmail.com',
                 pass: 'Kingcandy#22'
             }
         });
         let info = await transporter.sendMail({
          from: '"EPENSER" <epenser.service@gmail.com>', // sender address
          to: req.body.email+'', // list of receivers
          subject: "Your epenser password reset instruction.", // Subject line
          text: "Click on list below to reset your password.", // plain text body
          html: "<b>Password reset require.</b><p>To reset your epenser password click on the link below and create a new one.</p><link>"+process.env.email_url_prefix+token+"</link><p>Please finish your password reset process within 5 minutes.</p>"
        });
        res.send({
          id: info.messageId,
          mailer: nodemailer.getTestMessageUrl(info)
        })
      } catch (error) {
        res.status(400).send({message: error.message});
      }
    }
  },
  resume_session(req, res) {
    console.log('[elog]session resume:', req.user.username);
    try {
      // const data = jwt.verify(req.token, config.Authentication.secret);
      res.send({mesage: req.user});
      // res.send({mesage: 'token verified.'});
    } catch (err) {
      // console.log(err.message);
      res.status(403).send({error: err.message});
    }
  },
  async register(req, res) {
    try {
      // await user.create(req)
      const createduser = await user.create(req.body);
      console.log('[elog]register request:', req.body.name + ' ('+ req.body.username + ').');
      mastertoken = jwt.sign({"username": req.body.username, "email": req.body.email, "name": req.body.name}, config.Authentication.secret);
      await AX.post('/store/create', { name: 'Unknown store', description: 'create new store?', type: 'other', pic: "https://api.adorable.io/avatars/120/none.png"}, { headers: { Authorization: 'Bearer ' + mastertoken } })
      res.send(tool.getUser(createduser));
    } catch (err) {
      console.log('[elog]*register-failed:', req.body.username, req.body.email, req.body.password);
      res.status(400).send({
        message: 'Cannot create user.',
      });
    }
  },
  async all(req, res){
    const users = await user.findAll();
    res.send({
      alluser: users,
      connection: {
        port: process.env.PORT,
      }
    })
  },
  async login(req, res) {
    try {
      // old login.
      console.log('[elog]login request:', req.body.username);
      const {username, password} = req.body;
      const userininterest = await user.findOne({
        where: {
          username: username,
        },
      });
      // console.log(userininterest.dataValues)
      if (!userininterest) {
        res.status(400).send({
          message: 'Username "'+username+'" does not exist.',
        });
      }
      // console.log('login:', userininterest);
      const user_out = tool.getUser(userininterest);
      if (userininterest.password === password) {
        const token = signUser(user_out);
        res.send({
          user: user_out,
          token: token,
        });
      } else {
        res.status(400).send({
          message: 'Wrong password.',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: 'Cannot log in.',
      });
    }
  },
};
