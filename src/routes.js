const AuthController = require('./controllers/AuthController');
const UtilitiesController = require('./controllers/UtilitiesController');
const WalletController = require('./controllers/WalletController');
const TransactionController = require('./controllers/TransactionController');
const ReceiptController = require('./controllers/ReceiptController');
const storeController = require('./controllers/storeController');
const Middleware = require('./controllers/Middleware');


module.exports = app => {
  app.get('/OTA', AuthController.ota);
  app.get('/AU', Middleware.verify_token, Middleware.isAdmin,AuthController.all);

  
  app.post('/register', AuthController.register);
  app.post('/forget', AuthController.forget_password);
  app.post('/reset', Middleware.verify_token, AuthController.reset_password);
  app.post('/login', AuthController.login);
  app.post('/verify', Middleware.verify_token, AuthController.resume_session);
  app.post('/verify_reset', AuthController.verify);

  app.post('/wallet/create', Middleware.verify_token, WalletController.create);
  app.post('/wallet/update', Middleware.verify_token, WalletController.update);
  app.post('/wallet', Middleware.verify_token, WalletController.index);
  app.get('/wallet', Middleware.verify_token, WalletController.index);
  
  app.post('/wallet/transaction', Middleware.verify_token, TransactionController.index);
  app.post('/wallet/transaction/create', Middleware.verify_token, TransactionController.create);
  app.post('/wallet/transaction/delete', Middleware.verify_token, TransactionController.del);
  
  app.post('/wallet/transactions', Middleware.verify_token, ReceiptController.index);
  app.post('/wallet/transaction/createReceipt', Middleware.verify_token, ReceiptController.create);
  app.post('/wallet/transaction/deleteReceipt', Middleware.verify_token, ReceiptController.del);

  app.post('/store/create', Middleware.verify_token, storeController.create);
  app.get('/store', Middleware.verify_token, storeController.index);
};
