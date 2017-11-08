require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var cors = require('cors');
var passport = require('passport'),
  /* FacebookStrategy = require('passport-facebook').Strategy, */
  LocalStrategy = require('passport-local').Strategy;
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

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

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);

//authentication
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/schemaUser');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/register', function(req, res) {
  Account.register(acc = new Account({ username : req.body.username }), req.body.password, function(err, account) {
    var token = acc.generateJwt();
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        res.status(200);
        res.json({"token" : token});
      });
    }
  });
});

app.post('/api/login', function(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({"token" : token});
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
});

app.get('/api/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// view engine setup //future: get rid of this, no view engine used (also delete ejs from package.json)
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
/* GET home page. */ //future: get rid of this route, not used anywhere
app.get('/', function(req, res, next) {
  homeController.index(function(intro) {
    res.render('index', { title: 'Coucher', intro });
  });
});

/* API Routes */
//get couches in radius around lat & lon
app.get('/api/couches', auth, auth, function(req, res, next) {
  //future: try catch? in case querystring isn't complete?
  var lat = req.query.lat;
  var lon = req.query.lon;
  var rad = req.query.rad;

  apiController.getCouches(lat,lon,rad, function(couches) {
    res.json(couches);
  });
});

//get hitchhiking spots in radius around lat & lon
app.get('/api/hitchhikingspots', auth, function(req, res, next) {
  //try catch? in case querystring isn't complete?
  var lat = req.query.lat;
  var lon = req.query.lon;
  var rad = req.query.rad;

  apiController.getHitchhikingSpots(lat,lon,rad, function(hitchhikingSpots) {
    res.json(hitchhikingSpots);
  });
});

//get a hitchhiking spot's details
app.get('/api/hitchhikingspotdetails', auth, function(req, res, next) {
  //try catch? in case querystring isn't complete?
  var hwid = req.query.hwid;

  apiController.getHitchhikingSpotDetail(hwid, function(hitchhikingSpotDetails) {
    res.json(hitchhikingSpotDetails);
  });
});

//future: for trip http requests: make sure it's the trip owner that's making the edits (maybe in trip service in angular? idk)
//get trip
app.get('/api/trip/:id', auth, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200")
  apiController.getTrip(req.params.id, function(trip) {
    res.json(trip);
  })
});

//get a user's trips
app.get('/api/trips', auth, function(req, res, next) {
  console.log(req.payload);
  if (!req.payload._id) { //future: add this bit to all API routes that should be private
    res.status(401).json({
      "message" : "UnauthorizedError"
    });
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200")
    apiController.getTrips(req.payload._id, function(trips) { //future: add this in other API routes as well, to make sure they're editing their own trip
      res.json(trips);
    });
  }
});

//save (create) trip
app.post('/api/trip', auth, function(req, res, next) {
  var trip = req.body;
  if (!trip.name) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    trip.ownerid = req.payload._id;
    apiController.saveTrip(trip, function(newTrip){
      res.json(newTrip);
    });
  }
});

//delete trip
app.delete('/api/trip/:id', auth, function(req, res, next) {
    apiController.deleteTrip(req.params.tripid, function(){
      res.json("stop deleted");
    });
});

//update trip
app.put('/api/trip', auth, function(req, res, next) {
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

// future: make this once every week instead of once a day
//npm-schedule ("cronjob" in nodejs) to gather data from couch & hiking API's
/* var j = schedule.scheduleJob('0 0 * * *', function(){
  dataController.index();
}); */

/* dataController.index(); */

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

// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

module.exports = app;
