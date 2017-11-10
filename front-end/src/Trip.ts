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
    couchName?: String,
    couchUrl?: String,
    couchLocation?: [Number],
  }];
  hitchhikingSpots: [{
    spotid: Number,
    location?: [Number],
    spotAddress?: String,
  }];
}