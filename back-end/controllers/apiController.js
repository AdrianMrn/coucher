var _ = require('lodash');
var rp = require('request-promise');
var cheerio = require('cheerio');
var async = require('async');

var request = require('request');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var couch_schema = require('../models/schemaCouches').couch;
var hhspot_schema = require('../models/schemaHhSpots').hitchhikingSpot;
var trip_schema = require('../models/schemaTrips').trip;

exports.index = function(next){
    console.log("Starting to get data");

}

exports.getCouches = function(lat, lon, rad, next){
    console.log(lat, lon, rad);
    couch_schema.find({ 'locationInfo.locationCoords': { $nearSphere: { $geometry: { type: "Point", coordinates: [ 4.4025,51.2194 ] }, $maxDistance: 5*1600 } } })

    couch_schema.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lat,lon ] }, $maxDistance: rad*1000 } } })
    .limit(10)
    .exec(function(err, couches) {
        next(couches);
    });
}


exports.getTrip = function(id, next){
    trip_schema.findOne({_id: mongoose.Types.ObjectId(id)}, function(err, trip){
        if (err) console.log(err);
        next(trip);
    });
}

exports.saveTrip = function(trip, next){
    trip_schema.findOneAndUpdate({_id: mongoose.Types.ObjectId(trip.id)}, trip, {upsert: true}, function(err){
         if (err) console.log(err);
         next();
    });
}

exports.deleteTrip = function(tripid, next){
    trip_schema.remove({tripid: trip.tripid}, function(err){
         if (err) console.log(err);
         next();
    });
}

exports.updateTrip = function(trip, next){
    console.log(trip.stops);
    /* trip_schema.findByIdAndUpdate(trip._id, trip, {}, function(err) {
        if (err) console.log(err);
        next();
    }) */
    trip_schema.update({tripid: mongoose.Types.ObjectId(trip._id)}, trip, {}, function(err){
         if (err) console.log(err);
         next();
    });
}