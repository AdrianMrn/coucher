var _ = require('lodash');
var rp = require('request-promise');
var cheerio = require('cheerio');
var async = require('async');
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
        console.log(path.join("file://" + __dirname + '/..' + '/images/'));
        const options = {
            "format": 'A4',
            "header": {
                "height": "45mm",
                "contents": '<div class="title">Coucher.</div>'
            },
            "border": "1in",
            "base": path.join('file://' + __dirname + '/..' + '/images/'), //"file:///home/www/your-asset-path"
        };

        var html = `
        <html>
          <head>
            <meta charset="utf8">
            <title>PDF Test</title>
            <style>

                html {
                    font-family: 'Montserrat';
                }

                .title {
                    color: #3f8a91;
                    text-align: left;
                    font-size: 3em;
                    font-weight: bold;
                    margin: 0;
                }

                .wrapper {
                    width: 960px;
                    margin: 0 auto;
                    text-align: left;
                }

                .wrapper p {
                    font-size: .8em;
                }

                .wrapper h1 {
                    color: black;
                    font-size: 1.5em;
                }

                .wrapper .hitchhike {
                    height: 50px;
                    background-color: red;
                }

                .wrapper .hitchhike .icon {
                    background-image: url('icons/workflow/route.png');
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center center;
                    height: 50px;
                    width: 25px;

                    float: left;
                }

                .wrapper .hitchhike svg {
                    height: 15px;
                    width: 15px;
                    float: left;
                    margin: 15px 0 20px 0;

                    fill: #7a7a7a;
                }

                .wrapper .hitchhike p {
                    float: left;
                    color: #7a7a7a;
                    margin: 0 0 0 15px;
                    line-height: 50px;
                }

                .wrapper .hitchhike::after {
                    display: block;
                    clear: both;
                    content: "";
                }

                .wrapper .route {
                    position: relative;
                    background-color: white;
                    box-shadow: 1px 1px 1px #7a7a7a;
                    height: 50px;
                    width: 95%;
                }

                .wrapper .route p {
                    font-family: 'Esteban';
                    font-size: .8em;
                    margin: 0 0 5px 0;
                }

                .wrapper .route .marker {
                    position: absolute;
                    left: 5px;
                    top: 15px;
                    width: 20px;
                    height: 20px;
                }

                .wrapper .route .svg_marker_1 {
                    fill: #e86830;
                }

                .wrapper .route .svg_marker_2 {
                    fill: #e83a30;
                }

                .wrapper .route .info {
                    margin-left: 50px;
                    margin-top: 25px;
                    padding-top: 5px;
                }

                .wrapper .route .info div {
                    position: relative;
                    height: 20px;
                }

                .wrapper .route .info div svg {
                    margin: 2.5px 0;
                    float: left;
                    fill: #7a7a7a;
                    width: 15px;
                    height: 15px;
                }

                .wrapper .route .info div p {
                    float: left;
                    line-height: 20px;
                    margin: 0 0 0 10px;

                }

                .wrapper .route .info div::after {
                    clear: both;
                    display: block;
                    content: "";
                }

                .wrapper .route .info p {
                    color: #7a7a7a;
                    font-family: 'Montserrat';
                }
            </style>
          </head>
          <body>
            <div class="wrapper">
                <h1>Extra Information</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                    Porro voluptatem neque accusantium reiciendis eligendi, ex tempora! 
                    Numquam debitis atque eos nihil! Et adipisci at, eaque accusamus, 
                    veniam eum maiores nisi?
                </p>
            </div>
            <div class="wrapper">
                <div class="route">
                    <svg id="svg_marker" class="svg_marker_1 marker" data-name="svg_marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 79.41">
                        <title>marker</title>
                        <path d="M25,0C11.19,0,0,11.43,0,25.53,0,41.32,24.6,79.41,24.6,79.41S50,41.23,50,25.53C50,11.43,38.81,0,25,0Zm0,39.72A14,14,0,0,1,11.11,25.53,14,14,0,0,1,25,11.35,14,14,0,0,1,38.89,25.53,14,14,0,0,1,25,39.72Z"/>
                    </svg>
                    <div class="info">
                        <p>Antwerp, Belgium</p>
                        <div>
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 90 66.1" style="enable-background:new 0 0 90 66.1;" xml:space="preserve">
                                <g>
                                    <path d="M82.9,17c-9.2-0.3-12,5.9-14.6,12.3c-13.9-2.9-32.9-3-46.6,0.2C19.1,23.1,16.3,16.7,7.1,17C7.9,8.2,12.7,1.2,22,0.3
                                        c6.7-0.6,14.9,0,23,0c8,0,16.2-0.5,22.8,0C77.4,1.1,82.1,8.5,82.9,17z"/>
                                    <path d="M19.5,35.2c14.2-4.8,36.6-5.1,50.7,0c2.9-4,2.4-8.4,5.9-11.8c6.2-5.9,17.4,1.4,12.8,9.8c-1.1,2-2.9,2.9-5,4.1
                                        c-1.4,4.1-0.1,9.3-1.8,13.5c-1.1,2.7-4.9,4.5-8.7,4.8c-8.3,0.6-18.5,0-28.3,0c-10.1,0-19.5,0.6-28.3,0c-4.1-0.3-8.1-2.2-9.1-4.8
                                        c-1.5-3.9-0.6-9.3-1.6-13.3C1.7,35.5-1.4,31,0.6,26.1c0.8-2,3.5-4.5,6.6-4.8C16.2,20.4,16.2,29.9,19.5,35.2z"/>
                                    <path d="M17.6,66.1c-1.6,0-3.2,0-4.8,0c-3.3-0.6-2.9-4.8-2.8-8.7c2.4,1.7,6.3,1.8,10.5,1.8C20.7,62.7,20.3,65.6,17.6,66.1z"/>
                                    <path d="M77.2,66.1c-1.6,0-3.2,0-4.8,0c-2.7-0.4-3.3-3.8-2.7-6.9c4.1,0.2,8.2-0.4,10.3-1.6C80.2,61.5,80.4,65.5,77.2,66.1z"/>
                                </g>
                            </svg>
                            <p>Aalmoezenierstraat 49</p>
                        </div>
                    </div>
                </div>
                <div class="hitchhike">
                    <div class="icon"></div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 73.4 91.4" style="enable-background:new 0 0 73.4 91.4;" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M63.9,36.8L63.9,36.8c-1-0.6-2-1-3.1-1.4c-12.1-5.5-12-24.4-12-25.4c0-0.2,0.1-0.4,0.1-0.6c0-4.6-3.5-8.8-8.1-9.3
                                    S31.9,2.7,31,7.2c-0.6,2.5-0.6,15.3,5,27.2h-0.1c1.2,1.5,1.9,3.4,1.9,5.5c0,2.4-1,4.6-2.5,6.2c4.1,0.6,6.9,4.1,6.9,9
                                    c0,3.2-1.7,6-4.2,7.6c2.4,1.6,4,4.4,4,7.5c0,5-4.1,9.1-9.1,9.1c1.4,1.6,2.4,3.7,2.4,6c0,2.3-0.9,4.4-2.4,6.1h21.9
                                    c10.3,0,18.6-8.3,18.6-18.6V53C73.4,46,69.5,39.9,63.9,36.8z"/>
                                <path d="M26.2,79.3h-9.7c-3.3,0-6,2.7-6,6c0,3.3,2.7,6.1,6,6.1H23h3.3c3.3,0,6-2.7,6-6.1C32.2,81.9,29.5,79.3,26.2,79.3z"/>
                                <path d="M26.2,76.2h6.7c3.3,0,6-2.7,6-6c0-3.3-2.7-6-6-6H6.3H6.1c-3.3,0-6.1,2.7-6.1,6c0,3.3,2.7,6,6.1,6h10.3H26.2z"/>
                                <path d="M6.3,61h26.6h0.2c3.3,0,6-2.7,6-6s-1.8-6.1-5.2-6.1H33h-4.4H13.2H6.3c-3.3,0-6.1,2.7-6.1,6.1C0.2,58.3,3,61,6.3,61z"/>
                                <path d="M28.6,45.9c3.3,0,6-2.7,6-6.1c0-3.3-2.7-6-6-6H13.2c-3.3,0-6,2.7-6,6c0,3.4,2.7,6.1,6,6.1H28.6z"/>
                            </g>
                        </g>
                    </svg>
                    <p>Singel, Antwerpen</p>
                </div>
                <div class="route">
                    <svg id="svg_marker" class="svg_marker_2 marker" data-name="svg_marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 79.41">
                        <title>marker</title>
                        <path d="M25,0C11.19,0,0,11.43,0,25.53,0,41.32,24.6,79.41,24.6,79.41S50,41.23,50,25.53C50,11.43,38.81,0,25,0Zm0,39.72A14,14,0,0,1,11.11,25.53,14,14,0,0,1,25,11.35,14,14,0,0,1,38.89,25.53,14,14,0,0,1,25,39.72Z"/>
                    </svg>
                    <div class="info">
                        <p>Ghent, Belgium</p>
                        <div>
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 90 66.1" style="enable-background:new 0 0 90 66.1;" xml:space="preserve">
                                <g>
                                    <path d="M82.9,17c-9.2-0.3-12,5.9-14.6,12.3c-13.9-2.9-32.9-3-46.6,0.2C19.1,23.1,16.3,16.7,7.1,17C7.9,8.2,12.7,1.2,22,0.3
                                        c6.7-0.6,14.9,0,23,0c8,0,16.2-0.5,22.8,0C77.4,1.1,82.1,8.5,82.9,17z"/>
                                    <path d="M19.5,35.2c14.2-4.8,36.6-5.1,50.7,0c2.9-4,2.4-8.4,5.9-11.8c6.2-5.9,17.4,1.4,12.8,9.8c-1.1,2-2.9,2.9-5,4.1
                                        c-1.4,4.1-0.1,9.3-1.8,13.5c-1.1,2.7-4.9,4.5-8.7,4.8c-8.3,0.6-18.5,0-28.3,0c-10.1,0-19.5,0.6-28.3,0c-4.1-0.3-8.1-2.2-9.1-4.8
                                        c-1.5-3.9-0.6-9.3-1.6-13.3C1.7,35.5-1.4,31,0.6,26.1c0.8-2,3.5-4.5,6.6-4.8C16.2,20.4,16.2,29.9,19.5,35.2z"/>
                                    <path d="M17.6,66.1c-1.6,0-3.2,0-4.8,0c-3.3-0.6-2.9-4.8-2.8-8.7c2.4,1.7,6.3,1.8,10.5,1.8C20.7,62.7,20.3,65.6,17.6,66.1z"/>
                                    <path d="M77.2,66.1c-1.6,0-3.2,0-4.8,0c-2.7-0.4-3.3-3.8-2.7-6.9c4.1,0.2,8.2-0.4,10.3-1.6C80.2,61.5,80.4,65.5,77.2,66.1z"/>
                                </g>
                            </svg>
                            <p>Gentenierstraat 49</p>
                        </div>
                    </div>
                </div>
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
    console.log(tripid);
    trip_schema.remove({_id: mongoose.Types.ObjectId(tripid)}, function(err){
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