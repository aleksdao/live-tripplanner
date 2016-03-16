var express = require('express');
var Promise = require('bluebird');
var path = require('path');
var swig = require('swig');
swig.setDefaults({ cache: false });

var models = require('./db').models;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;

var app = express();

app.use('/client', express.static(path.join(__dirname, 'client')));
app.use('/vendor', express.static(path.join(__dirname, 'vendor')));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

module.exports = app;

app.use(function(req, res, next){
  var pages = [
    { url: '/about', title: 'About' },
    { url: '/contact', title: 'Contact' },
  ];
  res.locals.pages = pages;
  next();
});

app.get('/', function(req, res, next){
  Promise.join(Hotel.find(), Restaurant.find(), Activity.find())
    .spread(function(hotels, restaurants, activities){
      res.render('index', { title: 'Home',
        hotels: hotels,
        restaurants: restaurants,
        activities: activities
      });
    }, next);
});

app.use("/api/days", require("./routes/api/days"));

app.get('/about', function(req, res, next){
  res.render('about', {title: 'About'});
});

app.get('/contact', function(req, res, next){
  res.render('contact', {title: 'Contact'});
});

app.get('/error', function(req, res, next){
  next(new Error('silly error'));

});

app.use(function(req, res, next){
  var error = new Error('Page Not Found');
  error.status = 404;
  next(error);

});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('index', { title: 'Error', error: err });
});
