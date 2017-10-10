var mongoose = require('mongoose');
var _ = require('lodash');

exports.index = function(next){
    var intro = "Start creating your trip, add some waypoints!";
    next(intro);
}