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

    /* console.log("getDataHitchwiki started");
    getDataHitchwiki(function() {
        console.log("getDataHitchwiki finished");
    }); */

    console.log("getDataTrustroots started");
    getDataTrustroots(function() {
        console.log("getDataTrustroots finished");
    });
    
    /* console.log("getDataCouchsurfing started");
    getDataCouchsurfing(function() {
        console.log("getDataCouchsurfing finished");

    }); */
}

var getDataTrustroots = function(next) {
    //future: credentials in .env file

    var j = request.jar();
    request.post({url:'https://www.trustroots.org/api/auth/signin', form: {username:'adriaanmarain300@gmail.com',password:'adrirulez'}, jar: j}, function(err, httpResponse, body){
        request({url:'http://www.trustroots.org/api/offers?filters=&northEastLat=1000&northEastLng=1000&southWestLat=-1000&southWestLng=-1000', jar: j}, function (err, httpResponse, body) {
            if (err) console.log(err);

            couches = JSON.parse(body);
            async.eachLimit(couches, 4, function(couch, callbackCouches) {
                request({url:'http://www.trustroots.org/api/offers/' + couch._id, jar: j}, function (err, httpResponse, body) {
                    if(httpResponse.statusCode == 200) {
                        couch = JSON.parse(body);
                        var couchDetails = new couch_schema({
                            service: "trustroots.org",
                            name : couch.user.displayName,
                            lastLogin : couch.user.updated,
                            profile : couch.description,
                            avatar : null,
                            hostingStatus : couch.status,
                            location: [couch.location[1],couch.location[0]],
                            url: "https://www.trustroots.org/profile/" + couch.user.username,
                        });
                        couchDetails.save(function (err) {
                            if (err) {
                                console.log('Error adding Trustroots couch:', err);
                                callbackCouches();
                            } else {
                                console.log('Added Trustroots couch:', couch._id);
                                callbackCouches();
                            }
                        });
                    } else {
                        console.log("Error adding Trustroots couch: http", httpResponse.statusCode)
                        callbackCouches();
                    }
                });
            }, function(err) {
                if( err ) {
                    console.log('A place failed to process:', err);
                    //future: next() ?
                } else {
                    console.log('All places have been processed successfully');
                    //next
                }
            });
        }); 
    });

}

var getDataCouchsurfing = function(next) {
    var page = 1;
    var url = "https://www.couchsurfing.com/api/web/users/search?controller=user_profiles&action=hosts&region=europe&country=belgium&city=Brussel&perPage=10&page=";
    //var url = "https://www.couchsurfing.com/api/web/users/search?controller=user_profiles&action=hosts&region=europe&perPage=500&page=";

    rp(url + page.toString())
    .then(function (response) {
        response = JSON.parse(response);
        //console.log(response);
        if (response.users.length) {
            async.eachLimit(response.users, 20, function(couch, callbackCouches) {
                var couchDetails = new couch_schema({
                    service: "couchsurfing.com",
                    name : couch.publicName,
                    lastLogin : couch.lastLogin,
                    profile : couch.shortProfile,
                    avatar : couch.avatarUrl,
                    hostingStatus : couch.status,
                    location: [4.3517, 50.8503],
                    url: "https://www.couchsurfing.com" + couch.profileLink,
                });
                couchDetails.save(function (err) {
                    if (err) {
                        console.log(err);
                        callbackCouches();
                    } else {
                        console.log('meow');
                        callbackCouches();
                    }
                });
            }, function(err) {
                if( err ) {
                    console.log('A place failed to process:', err);
                    next();
                } else {
                    console.log('All places have been processed successfully');
                    next();
                }
            });
        }
    })
    .catch(function (err) {
        console.log("GETting from https://www.couchsurfing.com/api failed: ", err);
        next();
    });
}

var getDataHitchwiki = function(next) {
    /* steps:
        1.  Get continents from http://hitchwiki.org/maps/api/?continents
        2.  Loop through continents to get places (http://hitchwiki.org/maps/api/?continent=EU, http://hitchwiki.org/maps/api/?continent=NA, ...)
            Loop through places (result from continent request) & add (if not exist) to mongodb using hitchwikimaps id
        4.  Loop through places (getting from local mongodb) (http://hitchwiki.org/maps/api/?place=185, ...)
            Get each place's info to fill schemaHhSpots
        Done :)
    */

    rp('http://hitchwiki.org/maps/api/?continents')
    .then(function (responseContinents) {
        async.eachLimit(JSON.parse(responseContinents), 1, function(continent, callbackContinents) {
            //console.log(continent.code);
            rp('http://hitchwiki.org/maps/api/?continent=' + continent.code)
            .then(function (responsePlaces) {
                async.eachLimit(JSON.parse(responsePlaces), 20, function(place, callbackPlaces) {
                    hhspot_schema.findOneAndUpdate({hwid:place.id}, {
                        gotInfo : false,
                        hwid : place.id,
                        rating: place.rating,
                        location: [place.lon, place.lat],
                    }, {upsert:true}, function(err, response){
                        if (err) console.log(err);
                        console.log('Added place id', place.id);
                        callbackPlaces();
                    });
                }, function(err) {
                    if( err ) {
                        console.log('A place failed to process:', err);
                        next();
                    } else {
                        console.log('All', continent.name ,'\'s places have been processed successfully');
                        callbackContinents();
                    }
                });
        
            })
            .catch(function (err) {
                console.log("GETting from http://hitchwiki.org/maps/api/?continent=xx failed: ", err);
                next();
            });
        }, function(err) {
            if( err ) {
                console.log('A continent failed to process:', err);
                next()
            } else {
                console.log('All continents have been processed successfully, starting to get places per continent');
                hhspot_schema.find({gotInfo:false}, {_id : 1}, function(err, response){
                    if (err) console.log(err);
                    console.log(response);
                });
                hhspot_schema.find({gotInfo:false}, {_id : 1, hwid: 1}, function(err, responseGotInfo){
                    if (err) console.log(err);
                    async.eachLimit(responseGotInfo, 10, function(placeInfo, callbackPlacesInfo) {
                        rp('http://hitchwiki.org/maps/api/?place=' + placeInfo.hwid)
                        .then(function (place) {
                            place = JSON.parse(place);
                            console.log("Got place info:", place.id);
                            var placeid = placeInfo._id;
                            hhspot_schema.findOneAndUpdate({_id : placeid}, {
                                gotInfo : true,
                                locationName: place.location.locality,
                                url: place.link,
                                comments: place.comments,
                            }, function(err, response){
                                if (err) console.log(err);
                                callbackPlacesInfo();
                            });
                        })
                        .catch(function (err) {
                            console.log("Crawling failed for place id ", placeInfo.hwid, ":", err);
                            callbackPlacesInfo();
                        });
                    }, function(err) {
                        if( err ) {
                            console.log('A place failed to process:', err);
                            next();
                        } else {
                            console.log('All places\' info has been processed successfully');
                            next();
                        }
                    });
                });
            }
        });

    })
    .catch(function (err) {
        console.log("GETting from http://hitchwiki.org/maps/api/?continents failed: ", err);
        next();
    });
}