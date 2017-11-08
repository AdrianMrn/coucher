var mongoose = require('mongoose');
Schema = mongoose.Schema;

//var localConnection = mongoose.createConnection('mongodb://localhost/coucher');
var localConnection = mongoose.createConnection(process.env.MONGODB_URL);

var couchSchema = new Schema({
  service: String,
  name : String,
  lastLogin : String,
  profile : String,
  avatar : String,
  hostingStatus : String,
  location: { type: [Number], index: '2dsphere' },
  url: String,
}, {
  timestamps: true
});

var couch = localConnection.model('couch', couchSchema);

module.exports = {
    couch: couch
};