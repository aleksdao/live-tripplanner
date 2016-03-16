/* globals $,Mapper */

function Tripplanner(days, map, perm, attractions){
  this.currentIdx = 0;
  this.mapper = new Mapper(map, perm);
  this.days = days;
  this.attractions = attractions;
  if(this.days.length === 0)
    this.addDay();
  this.init();
  this.renderDayPicker(0);
}

Tripplanner.prototype.addDay = function(){
    $.post("/api/days/" + this.days.length, function(data) {

      console.log("add day", data);
    });
    this.days.push(
        {
          Hotels: [],
          Restaurants: [],
          Activities: []
        }
    );
    return this.days.length - 1;
};


Tripplanner.prototype.init = function(){
  var that = this;
  $('#dayPicker').on('click', 'li', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    that.currentIdx = $(this).index();
    that.renderDay();
  });

  this.dayListIterator(function(list){
    var that = this;
    list.on('click', 'li', function(){
      var id = $(this).attr('data-id');
      var category = $(this).attr('data-category');
      var item = that.findItemByIdAndCategory(id, category);
      $(this).remove();
      // $.ajax({

      // })
      that.removeItemFromDay(item);
    });
  });

  this.categoryIterator(function(category){
    var btn = $('#' + category + 'Add');
    var that = this;

    btn.click(function(){
      console.log('getting clicked');
      var selector = that.getChooser(category);
      if(that.days.length === 0 || !selector.val())
        return;
      var _id = selector.val();

      var item = that.findItemByIdAndCategory(selector.val(), category);
      $.ajax({
          url: "/api/days/" + that.currentIdx + "?" + category + "=" + item._id,
          type: "PUT",
          success: function(json) {
            console.log("added data", json);

          },
          error: function(errObj) {
            console.log("error", errObj);
          }
      });
      that.renderItem(item);
    });
  });

  $('#dayAdder').click(function(){
    that.renderDayPicker(that.addDay());
  });

  $('#dayRemover').click(function(){
    that.removeDay();
  });
};

Tripplanner.prototype.removeDay = function(){
  var that = this;
  $.ajax({
    url: "/api/days/" + that.currentIdx,
    type: "DELETE",
    success: function(json) {
      console.log("added data", json);
    },
    error: function(errObj) {
      console.log("error", errObj);
    }
  });
  that.days.splice(that.currentIdx, 1);
  if (that.days.length === 0){
    that.addDay();
  }
  that.renderDayPicker(that.currentIdx === 0 ? 0 : that.currentIdx--);
};

Tripplanner.prototype.findItemByIdAndCategory = function(id, category){
    return this.attractions[category].filter(function(_item){
      return _item._id == id;
    })[0];
};

Tripplanner.prototype.categoryIterator = function(fn){
  fn = fn.bind(this);
  ['Hotels', 'Restaurants', 'Activities'].forEach(fn);
};

Tripplanner.prototype.getChooser = function(category){
    return $('#' + category + 'Chooser');
};

Tripplanner.prototype.chooserIterator = function(fn){
  this.categoryIterator(function(cat){
      fn(this.getChooser(cat));
  });
};

Tripplanner.prototype.getDayList = function(category){
    return $('#dayList' + category );
};

Tripplanner.prototype.dayListIterator = function(fn){
    fn = fn.bind(this);
    this.categoryIterator(function(cat){
        fn(this.getDayList(cat));
    });
};

Tripplanner.prototype.resetLists = function(){
    this.dayListIterator(function(dayList){
      dayList.empty();
    });

    this.chooserIterator(function(chooser){
      chooser.children().removeClass('hidden').show();
    });
    this.mapper.reset();
};

Tripplanner.prototype.hideItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.hide().addClass('hidden');
    var sibs = option.siblings(':not(.hidden)');
    if(sibs.length)
      chooser.val(sibs[0].value);
    else
      chooser.val(null);
};

Tripplanner.prototype.showItemInChooser = function(item){
    var chooser = this.getChooser(item.category);
    var option = $('[value=' + item._id + ']', chooser);
    option.show().removeClass('hidden');
};

Tripplanner.prototype.removeItemFromDay = function(item){
    this.showItemInChooser(item);
    $.ajax({
      url: "/api/days/" + this.currentIdx + "?" + item.category + "=" + item._id,
      type: "DELETE",
      success: function(json) {
        console.log("added data", json);

      },
      error: function(errObj) {
        console.log("error", errObj);
      }
    });
    var collection = this.days[this.currentIdx][item.category];
    if (typeof collection == 'Array'){
      var idx = collection.indexOf(item._id);
      collection.splice(idx, 1);
    }
    else {
      this.days[this.currentIdx][item.category] = null;
    }
    this.mapper.removeMarker(item);

};

Tripplanner.prototype.renderDayPicker = function(){

    $('#dayPicker').empty();
    this.days.forEach(function(day, index){
      var link = $('<a />').html(index + 1);
      var li = $('<li />').append(link);
      if(day === this.currentDay())
        li.addClass('active');
      $('#dayPicker').append(li);
    }, this);
    this.renderDay();
};

Tripplanner.prototype.currentDay = function(){
  return this.days[this.currentIdx];
}

Tripplanner.prototype.renderDay = function(){
    var that = this;
    this.resetLists();

    if(this.currentIdx === null)
      return;
    $.ajax({
      url: "/api/days/" + that.currentIdx,
      type: "GET",
      success: function(data) {
        var day = data;
        var ids;
        console.log("which day is this", day)
        that.categoryIterator(function(category) {
          if(category !== "Hotels") {
            ids = day[category];
          }
          else {
            if(day[category]) ids = [day[category]];
            else ids = [];
          }
          ids.forEach(function(id){
            var item = this.findItemByIdAndCategory(id, category);
            this.renderItem(item);
          }, that);
        })
      },
      error: function(errObj) {
        console.log("error", errObj);
      }
  });
};

Tripplanner.prototype.renderItem = function(item){
  var list = this.getDayList(item.category);
  var li = $('<li />').addClass('list-group-item');
  li.attr('data-id', item._id);
  li.attr('data-category', item.category);
  li.html(item.name);
  list.append(li);
  this.hideItemInChooser(item);
  this.mapper.addMarker(item);
};