export class Trip {
    name: String;
    travelmode: String;
    stops: [{
      stop: Number,
      locationName: String,
      location: [Number],
      couchid: String,
    }];
    hitchhikingSpots: [{
      spot: Number,
      spotid: String,
    }];
}