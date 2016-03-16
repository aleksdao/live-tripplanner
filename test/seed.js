var db = require('../db');
var models = db.models;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Place = models.Place;

var Promise = require('bluebird');

var hotel = {name: "Andaz Wall Street", place: new Place({address: "75 Wall St", city: "New York", state: "NY", phone: "123-456-7890", location: [40.705137, -74.007624]}), num_stars: 4, amenities: "Pool, Free Wi-Fi" };

var restaurant = {name: "Bouley", place: new Place({address: "75 Wall St", city: "New York", state: "NY", phone: "123-456-7890", location: [40.705137, -74.013940]}), cuisine: "French", price: 4};

var activity = {name: "Mahayana Temple Buddhist Association", place: new Place({address: "133 Canal St", city: "New York", state: "NY", phone: "123-456-7890", location: [40.716291, -73.995315]}), age_range: "All" };

module.exports = function(){
  return db.connect()
    .then(function(){
      return Promise.all([Hotel.remove(), Restaurant.remove(), Activity.remove()]);
    })
    .then(function(){
      return Promise.join(Hotel.create(hotel), Restaurant.create(restaurant), Activity.create(activity));
    })
    .spread(function(hotel, restaurant, activity){
      console.log(hotel);
      console.log(restaurant);
      console.log(activity);
    });

};
