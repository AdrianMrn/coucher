var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var couchSchema = mongoose.Schema({
  name : String,
  description : String,
});
var couch = mongoose.model('Couch', couchSchema);

module.exports = {
    couch: couch
};