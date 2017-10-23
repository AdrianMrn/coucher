var _ = require('lodash');
var rp = require('request-promise');
var cheerio = require('cheerio');
var async = require('async');

var request = require('request');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var couch_schema = require('../models/schemaCouches').couch;
var hhspot_schema = require('../models/schemaHhSpots').hitchhikingSpot;

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