var _ = require('lodash');
var rp = require('request-promise');
var cheerio = require('cheerio');
var async = require('async');
var pdfMakePrinter = require('../pdfmake/src/printer');
var path = require('path');

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
        if (err) console.log(err);
        next(hhspot);
    });
}

//export a trip as pdf
exports.exportTrip = function(id, next){
    trip_schema.findOne({_id: mongoose.Types.ObjectId(id)}, function(err, trip){
        if (err) console.log(err);
        var fontDescriptors = {
            Roboto: {
                normal: path.join(__dirname, '..', 'pdfmake', 'examples', '/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', 'pdfmake', 'examples', '/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', 'pdfmake', 'examples', '/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '..', 'pdfmake', 'examples', '/fonts/Roboto-MediumItalic.ttf')
            }
        };
        
        var printer = new pdfMakePrinter(fontDescriptors);
        var docDefinition = {
            content: [
                {text: 'Coucher Trip Export', style: 'header'},
                'This is an export of your trip on coucher. Make sure all your chosen hosts have confirmed with you personally, this is not a service we offer!'
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            }
        };

        var doc = printer.createPdfKitDocument(docDefinition);
        var chunks = [];
        var result;
        doc.on('data', function (chunk) {
            chunks.push(chunk);
        });
        doc.on('end', function () {
            result = Buffer.concat(chunks);
            next('data:application/pdf;base64,' + result.toString('base64'));
        });
        doc.end();
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
    trip_schema.find({ownerid: ownerid}, function(err, trips){
        if (err) console.log(err);
        next(trips);
    }).sort('createdAt');
}

//create a new trip
exports.saveTrip = function(trip, next){
    trip_schema.findOneAndUpdate({_id: mongoose.Types.ObjectId(trip.id)}, trip, {upsert: true, new: true}, function(err, newTrip){
        if (err) console.log(err);
        console.log(newTrip);
        next(newTrip);
    });
}

//delete a trip
exports.deleteTrip = function(tripid, next){
    trip_schema.remove({tripid: trip.tripid}, function(err){
        if (err) console.log(err);
        next();
    });
}

//update a trip (adding & removing stops + hitchhiking points + couches)
exports.updateTrip = function(trip, next){
    trip_schema.update({_id: mongoose.Types.ObjectId(trip._id)}, trip, {}, function(err){
        if (err) console.log(err);
        next();
    });
}