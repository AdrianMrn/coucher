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

//get all couches in a radius around a latitude & longitude point
exports.getCouches = function(lat, lon, rad, next){
    /* couch_schema.find({ 'locationInfo.locationCoords': { $nearSphere: { $geometry: { type: "Point", coordinates: [ 4.4025,51.2194 ] }, $maxDistance: 5*1600 } } }) */
    couch_schema.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lon,lat ] }, $maxDistance: rad*1000 } } })
    .limit(10)
        .exec(function(err, couches) {
            if (err) console.log(err);
            next(couches);
        });
}

//get all of a couch's details by its _id
exports.getCouchDetail = function(id, next){
    couch_schema.findOne({_id: id}, function(err, couch){
        if (err) console.log(err);
        next(couch);
    });
}

//get all hitchhiking spots in a radius around a latitude & longitude point
exports.getHitchhikingSpots = function(lat, lon, rad, next){
    hhspot_schema.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ lon,lat ] }, $maxDistance: rad*1000 } } })
        .exec(function(err, hitchhikingSpots) {
            if (err) console.log(err);
            next(hitchhikingSpots);
        });
}

//get all of a hitchhiking spot's details by its hitchwiki id
exports.getHitchhikingSpotDetail = function(hwid, next){
    hhspot_schema.findOne({hwid: hwid}, function(err, hhspot){
        if (err) console.log(err); //future: send address?
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + hhspot.location[1]+","+hhspot.location[0] + "&key=" + process.env.GOOGLE_JAVASCRIPT_API_KEY;
        request(url, function (error, response, body) {
            if (error) {
                console.log(error);
                next(hhspot, null);
            } else {
                res = JSON.parse(body);
                if (res.status == 'OK') {
                    var address = res.results[0].formatted_address;
                    next(hhspot, address);
                } else {
                    next(hhspot, null);
                }
            }
        });
    });
}

//export a trip as pdf
exports.exportTrip = function(id, owner, next){
    trip_schema.findOne({_id: mongoose.Types.ObjectId(id), owner:owner}, function(err, trip){
        if (err) console.log(err);

        const options = {
            "format": 'A4',
            "header": {
                "height": "45mm",
                "contents": '<div style="text-align: center;">Coucher</div>'
            },
            "border": "1in",
        };

        var html = `
        <html>
          <head>
            <meta charset="utf8">
            <title>PDF Test</title>
            <style>
            .page {
              position: relative;
              height: 90mm;
              width: 50mm;
              display: block;
              page-break-after: auto;
              margin: 50px;
              overflow: hidden;
            }
            </style>
          </head>
          <body>
            <div class="page">
              Page 1
            </div>
            <h1>TINE IS DE ALLERLIEFSTE EN DE ALLERMOOISTE</h1>
            <div class="page">
              Page 2
            </div>
          </body>
        </html>
        `;

        next(html, options);
    });
}

//get a trip by its mongo id
exports.getTrip = function(id, next){
    trip_schema.findOne({_id: mongoose.Types.ObjectId(id)}, function(err, trip){
        if (err) console.log(err);
        next(trip);
    });
}

//get a user's trips by their userid
exports.getTrips = function(ownerid, next){
    trip_schema.find({ownerid: ownerid}, {name:1}, function(err, trips){
        if (err) console.log(err);
        next(trips);
    }).sort('createdAt');
}

//create a new trip
exports.saveTrip = function(trip, next){
    trip_schema.findOneAndUpdate({_id: mongoose.Types.ObjectId(trip.id)}, trip, {upsert: true, new: true}, function(err, newTrip){
        if (err) console.log(err);
        next(newTrip);
    });
}

//delete a trip
exports.deleteTrip = function(tripid, ownerid, next){
    console.log(tripid);
    trip_schema.remove({_id: mongoose.Types.ObjectId(tripid), ownerid: ownerid}, function(err){
        if (err) console.log(err);
        next();
    });
}

//update a trip (adding/removing stops + hitchhiking points + couches)
exports.updateTrip = function(trip, ownerid, next){
    //reverse geocoding hitchhiking spot & couch coordinates to get addresses where we don't have them yet
    async.each(trip.hitchhikingSpots, function(hitchhikingSpot, callback) {
        if (!hitchhikingSpot.spotAddress && hitchhikingSpot.location[0] != undefined) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + hitchhikingSpot.location[0]+","+hitchhikingSpot.location[1] + "&key=" + process.env.GOOGLE_JAVASCRIPT_API_KEY;
            request(url, function (error, response, body) {
                if (error) {
                    console.log(error);
                    callback();
                } else {
                    res = JSON.parse(body);
                    if (res.status == 'OK') {
                        hitchhikingSpot.spotAddress = res.results[0].formatted_address;
                        callback();
                    } else callback();
                }
            });
        } else callback();
    }, function(err) {
        if( err ) {
            console.log('A place failed to process:', err);
            next();
        } else {
            trip_schema.update({_id: mongoose.Types.ObjectId(trip._id), ownerid: ownerid}, trip, {}, function(err){
                if (err) console.log(err);
                next();
            });
        }
    });
}