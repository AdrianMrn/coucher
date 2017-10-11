var mongoose = require('mongoose');
Schema = mongoose.Schema;

var localConnection = mongoose.createConnection('mongodb://localhost/coucher');

var couchSchema = new Schema({
  name : String,
  description : String,
  service: String,
  location: { type: [Number], index: '2dsphere' },
  url: String,
}, {
  timestamps: true
});

var couch = localConnection.model('couch', couchSchema);

module.exports = {
    couch: couch
};