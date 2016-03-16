var expect = require('chai').expect;
var db = require('../db');
var Hotel = db.models.Hotel;
var Restaurant = db.models.Restaurant;
var Activity = db.models.Activity;
var seed = require('./seed');

describe('models', function(){
  beforeEach(function(done){
    seed()
      .then(function(){
        done();
      });
  
  });

  describe('hotels', function(){
    var hotels, andaz;
    beforeEach(function(done){
      Hotel.find()
        .then(function(_hotels){
          hotels = _hotels;
          andaz = hotels[0];
          done();
        }, done);
    });

    it('Andaz hotel name is correct', function(){
      expect(andaz.name).to.equal('Andaz Wall Street');
    });

    it('Andaz Hotel is on wall street', function(){
      expect(andaz.place.address).to.equal('75 Wall St');
    });

    it('Andaz Hotels place can say hi', function(){
      expect(andaz.place.sayHi()).to.equal('75 Wall St');
    });

    describe('creating a hotel', function(){
      var howardJohnson;
      beforeEach(function(done){
        howardJohnson = new Hotel({
          name: 'Howard Johnson'
        });
        howardJohnson.save()
          .then(function(){
            done();
          }, done);

      
      });
      it('can be created', function(){
        expect(howardJohnson).to.be.ok;
      });
    
    });
  
  });

  describe('restaurants', function(){
    var restaurants;
    beforeEach(function(done){
      Restaurant.find()
        .then(function(_restaurants){
          restaurants = _restaurants;
          done();
        }, done);
    });

  });

  describe('activities', function(){
    var activities;
    beforeEach(function(done){
      Activity.find()
        .then(function(_activities){
          activities = _activities;
          done();
        }, done);
    });

    it('first activity is Mahayana Temple', function(){
      expect(activities[0].name).to.equal('Mahayana Temple Buddhist Association');
    });


  });
});
