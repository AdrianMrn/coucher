var mongoose = require('mongoose');
Schema = mongoose.Schema;

//var localConnection = mongoose.createConnection('mongodb://localhost/coucher');
var localConnection = mongoose.createConnection('mongodb://AdriaanMrn:AdriaanMrn@ds231315.mlab.com:31315/coucher');

var tripSchema = new Schema({
  name: String,
  travelmode: String,
  stops: [{
    stopid: Number,
    locationName: String,
    location: [Number],
    couchid: String,
  }],
  hitchhikingSpots: [{
    spot: Number,
    spotid: String,
  }],
}, {
  timestamps: true
});

var trip = localConnection.model('trip', tripSchema);

module.exports = {
    trip: trip
};

//future: add owner (user) id