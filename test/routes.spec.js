var request = require('supertest-as-promised')(require('../app'));
var expect = require('chai').expect;
var db = require('../db');
var seed = require('./seed');
var cheerio = require('cheerio');

describe('Routes', function(){
  before(function(done){
    seed()
      .then(function(){
        done();
      });
  });

  describe('/', function(){
    it('returns the home page', function(){
      return request.get('/')
        .expect(200)
        .then(function(res){
          expect(res.text).to.contain('Home');
          expect(res.text).to.contain('Andaz Wall Street');
          expect(res.text).to.contain('Bouley');
          expect(res.text).to.contain('Temple');
        });
    });
  
  });

  describe('/about', function(){
    it('returns the about', function(){
      return request.get('/about')
        .expect(200)
        .then(function(res){
          var $ = cheerio.load(res.text);
          expect($('.title:contains("About")').length).to.eq(1);
          expect($('a:contains("About")').parent().hasClass('active')).to.be.ok;
        });
    });
  });

  describe('/contact', function(){
    it('returns the contact page', function(){
      return request.get('/contact')
        .expect(200)
        .then(function(res){
          var $ = cheerio.load(res.text);
          expect($('.title:contains("Contact")').length).to.eq(1);
        });
    });
  });

  describe('/foo', function(){
    it('returns not found page', function(){
      return request.get('/foo')
        .expect(404)
        .then(function(res){
          expect(res.text).to.contain('Page Not Found');
        });
    });
  });

  describe('/error', function(){
    it('returns error page', function(){
      return request.get('/error')
        .expect(500)
        .then(function(res){
          expect(res.text).to.contain('silly error');
        });
    });
  });
});
