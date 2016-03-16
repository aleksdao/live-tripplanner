$(function() {
  var days = [];
  $.get("/api/days", function(data) {
    // console.log(data)
    days = data;
    var fn = function(map, marker){
      new Tripplanner(days, map, marker, attractions);
      console.log("inside function", days);
  }

    initialize_gmaps(fn);

  })
  // var fn = function(map, marker){
  //     new Tripplanner(days, map, marker, attractions);
  //     console.log(days);
  // }
});
