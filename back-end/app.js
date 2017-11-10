require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var cors = require('cors');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var pdf = require('html-pdf');

var dataController = require('./controllers/dataController');
var apiController = require('./controllers/apiController');

var app = express();
app.use(cors());

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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//npm-schedule ("cronjob" in nodejs) to gather data from couch & hiking API's. Updating the data once every month
var j = schedule.scheduleJob('0 4 1 * *', function(){
  dataController.index();
});

/* Routes */
app.get('/', function(req, res, next) {
  res.send('¯\\\_(ツ)_/¯');
});

/* API Routes */
//get couches in radius around lat & lon
app.get('/api/couches', auth, function(req, res, next) {
  var coords = req.query;
  if (!coords.lat || !coords.lon || !coords.rad) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.getCouches(coords.lat,coords.lon,coords.rad, function(couches) {
      res.json(couches);
    });
  }
});

//get a couch's details
app.get('/api/couchdetails', auth, function(req, res, next) {
  if (!req.query.couchid) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.getCouchDetail(req.query.couchid, function(couchDetails) {
      res.json(couchDetails);
    });
  } 
});

//get hitchhiking spots in radius around lat & lon
app.get('/api/hitchhikingspots', auth, function(req, res, next) {
  var coords = req.query;
  if (!coords.lat || !coords.lon || !coords.rad) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.getHitchhikingSpots(coords.lat,coords.lon,coords.rad, function(hitchhikingSpots) {
      res.json(hitchhikingSpots);
    });
  }
});

//get a hitchhiking spot's details
app.get('/api/hitchhikingspotdetails', auth, function(req, res, next) {
  if (!req.query.hwid) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    apiController.getHitchhikingSpotDetail(req.query.hwid, function(hitchhikingSpotDetails, address) {
      res.json({hitchhikingSpotDetails: hitchhikingSpotDetails, address:address});
    });
  }
});

//export trip as pdf
app.get('/api/exporttrip/:id', auth, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.LINK_TO_FRONTEND);
  res.set('Content-type', 'application/pdf');
  apiController.exportTrip(req.params.id, req.params.id, function(html, options) {
    pdf.create(html,options).toStream(function(err, stream){
      stream.pipe(res);
    });
  })
});

//get trip
app.get('/api/trip/:id', auth, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.LINK_TO_FRONTEND)
  apiController.getTrip(req.params.id, function(trip) {
    res.json(trip);
  })
});

//get a user's trips
app.get('/api/trips', auth, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.LINK_TO_FRONTEND)
  apiController.getTrips(req.payload._id, function(trips) {
    res.json(trips);
  });
});

//create trip
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
    apiController.deleteTrip(req.params.id, req.payload._id, function(){
      res.json("trip deleted");
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
    apiController.updateTrip(trip, req.payload._id, function(){
      res.json(trip);
    });
  }
});

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
