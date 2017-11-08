var mongoose = require('mongoose');
Schema = mongoose.Schema;

// var localConnection = mongoose.createConnection('mongodb://localhost/coucher');
var localConnection = mongoose.createConnection(process.env.MONGODB_URL);

var hitchhikingSpotSchema = new Schema({
  gotInfo : {type: Boolean, index: true},
  hwid : Number,
  rating: String,
  location: { type: [Number], index: '2dsphere' },
  locationName: String,
  url: String,
  comments: [{
    id: Number,
    comment: String
  }],
}, {
  timestamps: true
});

var hitchhikingSpot = localConnection.model('hitchhikingSpot', hitchhikingSpotSchema);

hitchhikingSpot.ensureIndexes(function(err) {
  if (err)
      console.log(err);
  else
      console.log('Created hitchhikingSpot indexes successfully!');
});

module.exports = {
    hitchhikingSpot: hitchhikingSpot
};