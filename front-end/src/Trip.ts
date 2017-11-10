export class Trip {
  _id: String;
  ownerid: String;
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
    location?: [Number],
    spotAddress?: String,
  }];
}