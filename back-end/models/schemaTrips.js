var mongoose = require('mongoose');
Schema = mongoose.Schema;

var localConnection = mongoose.createConnection('mongodb://localhost/coucher');

var tripSchema = new Schema({
  name: String,
  travelmode: String,
  stops: [{
    stop: Number,
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