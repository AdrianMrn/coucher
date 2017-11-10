export class Trip {
  _id: String;
  name: String;
  travelmode: String;
  stops: [{
    stopid: Number,
    locationName: String,
    location: [Number],
    couchid: String,
  }];
  hitchhikingSpots: [{
    spotid: Number,
  }];
}