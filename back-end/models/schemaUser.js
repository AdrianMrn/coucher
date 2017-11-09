var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');
var jwt = require('jsonwebtoken');

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

Account.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
  };

module.exports = mongoose.model('Account', Account);