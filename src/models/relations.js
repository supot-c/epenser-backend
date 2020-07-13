module.exports = db => {
  db['user'].hasMany(db['wallet'], {foreignKey: 'username'});
  // db['wallet'].belongsTo(db['user'], { forignKey: 'username' })
  db['wallet'].hasMany(db['receipt'], {foreignKey: 'wallet_id', onDelete: 'cascade', hooks: true });
  db['receipt'].belongsTo(db['store']);
  db['transaction'].belongsTo(db['receipt'], {foreignKey: 'receipt_id', onDelete: 'cascade',hooks: true });
  // db['user'].hasMany(db['store'], {foreignKey: 'owner'});
  db['store'].belongsTo(db['user'], {foreignKey: 'owner'});
};
