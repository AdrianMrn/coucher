var mongoose = require('mongoose');
Schema = mongoose.Schema;

//var localConnection = mongoose.createConnection('mongodb://localhost/coucher');
var localConnection = mongoose.createConnection(process.env.MONGODB_URL);

var tripSchema = new Schema({
  ownerid: String,
  name: String,
  travelmode: String,
  stops: [{
    stopid: Number,
    locationName: String,
    location: [Number],
    couchid: String,
    couchName: String,
    couchUrl: String,
    couchLocation: [Number],
  }],
  hitchhikingSpots: [{
    spotid: Number,
    location: [Number],
    spotAddress: String,
  }],
}, {
  timestamps: true
});

var trip = localConnection.model('trip', tripSchema);

module.exports = {
    trip: trip
};

//future: add owner (user) id