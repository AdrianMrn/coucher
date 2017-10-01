var mongoose = require('mongoose');
var _ = require('lodash');

exports.index = function(next){
    var answer = "okden";
    next(answer);
}