var express = require("express");
var router = express.Router();
var db = require("../../db");
var Days = db.models.Day;

router.get("/", function(req, res, next) {
  Days.find()
    .then(function(days) {
      // console.log(days);
      res.send(days);
    });
});

// router.param("/:number", function(req, res, next, number) {

// })

router.get("/:number", function(req, res, next) {
  Days.findOne({Number: Number(req.params.number)})
    .exec()
    .then(function(day) {
      res.json(day);
    })
});

router.post("/:number", function(req, res, next) {
  Days.create({ Number: Number(req.params.number)})
    .then(function(day) {
      res.json(day);
    })
});

router.put("/:number", function(req, res, next) {
  var attractionType = Object.keys(req.query)[0];
  var attractionId = req.query[attractionType];
  Days.findOne({Number: Number(req.params.number)})
    .exec()
    .then(function(day) {
      if(attractionType !== "Hotels") day[attractionType].push(attractionId);
      else day[attractionType] = attractionId;
      return day.save();
    })
    .then(function(day) {
      res.json(day);
    })
});

router.delete("/:number", function(req, res, next) {
  var dayId = Number(req.params.number);
  if(Object.keys(req.query).length > 0) {
    var attractionType = Object.keys(req.query)[0];
    var attractionId = req.query[attractionType];
    Days.findOne({Number: dayId})
      .then(function(day) {
        if (attractionType == "Hotels"){
          day.Hotels = undefined;
        }
        else{
          day[attractionType].splice(day[attractionType].indexOf(attractionId), 1);
        }
        return day.save();
      })
  }
  else {
    console.log("trying to remove a day");
    // var dayPromises = [];
    Days.remove({Number: dayId})
      .exec()
      .then(function(){
        console.log("successfully removed a day");
        return Days.find({Number: {$gt: dayId}});
      })
      .then(function(days){
        console.log("about to Promise.all");
        return Promise.all(days);
      })
      .then(function(days) {
        console.log("inside the promise");
        days.forEach(function(day) {
          console.log("decrementing day " + day.Number);
          day.Number--;
          day.save();
        })
      });
  }
});

module.exports = router;