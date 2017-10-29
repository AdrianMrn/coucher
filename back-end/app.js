var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var cors = require('cors');
var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

var homeController = require('./controllers/homeController');
var dataController = require('./controllers/dataController');
var apiController = require('./controllers/apiController');

var app = express();
app.use(cors());

// configuration of passport facebook
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://www.example.com/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* Routes */
/* GET home page. */
app.get('/', function(req, res, next) {
  homeController.index(function(intro) {
    res.render('index', { title: 'Coucher', intro });
  });
});

/* API Routes */
//get couches in radius around lat & lon
app.get('/api/couches', function(req, res, next) {
  //try catch? in case querystring isn't complete?
  var lat = req.query.lat;
  var lon = req.query.lon;
  var rad = req.query.rad;

  apiController.getCouches(lat,lon,rad, function(couches) {
    res.json(couches);
  });
});

//get hitchhiking spots in radius around lat & lon
app.get('/api/hitchhikingspots', function(req, res, next) {
  //try catch? in case querystring isn't complete?
  var lat = req.query.lat;
  var lon = req.query.lon;
  var rad = req.query.rad;

  apiController.getHitchhikingSpots(lat,lon,rad, function(hitchhikingSpots) {
    res.json(hitchhikingSpots);
  });
});

//get a hitchhiking spot's details
app.get('/api/hitchhikingspotdetails', function(req, res, next) {
  //try catch? in case querystring isn't complete?
  var hwid = req.query.hwid;

  apiController.getHitchhikingSpotDetail(hwid, function(hitchhikingSpotDetails) {
    res.json(hitchhikingSpotDetails);
  });
});

//get trip
app.get('/api/trip/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200")
  apiController.getTrip(req.params.id, function(trip) {
    res.json(trip);
  })
});

//save trip
app.post('/api/trip', function(req, res, next) {
  var trip = req.body;
  if (!trip.name) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.saveTrip(trip, function(){
      res.json(trip);
    });
  }
});

//delete trip
app.delete('/api/trip/:id', function(req, res, next) {
  //future: get tripid & stopid (in req query? idk if this is possible in http delete.. so might have to just get rid of the stop in coucher.component.ts & then simply put)
    apiController.deleteTrip(req.params.tripid, function(){
      res.json("stop deleted");
    });
});

//update trip
app.put('/api/trip', function(req, res, next) {
  var trip = req.body;
  if (!trip.name) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.updateTrip(trip, function(){
      res.json(trip);
    });
  }
});

//npm-schedule ("cronjob" in nodejs) to gather data from couch & hiking API's
/* var j = schedule.scheduleJob('0 0 * * *', function(){
  dataController.index();
}); */

dataController.index();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
