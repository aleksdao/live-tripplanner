function Mapper(map, perm){
  this.points = {
    perm: perm
  };
  this.map = map;
}

Mapper.prototype.icons = { 
  Restaurants: 'http://maps.google.com/mapfiles/kml/pal2/icon37.png', 
  Hotels: 'http://maps.google.com/mapfiles/kml/pal2/icon20.png', 
  Activities: 'http://maps.google.com/mapfiles/kml/pal2/icon57.png' 
};

Mapper.prototype._setBounds = function(){
  var bounds = new google.maps.LatLngBounds();
  Object.keys(this.points).forEach(function(id){
    bounds.extend(this.points[id].position);
  }, this);
  this.map.fitBounds(bounds);
}

Mapper.prototype.addMarker = function(item){
    var pt = new google.maps.LatLng(item.place.location[0],item.place.location[1]);
    var marker = new google.maps.Marker({
        position: pt,
        title: item.name,
        icon: this.icons[item.category] 
    });
    marker.setMap(this.map);
    this.points[item._id] = marker;
    this._setBounds();
};

Mapper.prototype.removeMarker = function(item){
  var marker = this.points[item._id];
  marker.setMap(null);
  delete this.points[item._id];
  this._setBounds();
};

Mapper.prototype.reset = function(){
  Object.keys(this.points).forEach(function(key){
    if(key !== 'perm')
      this.points[key].setMap(null);
  }, this);
  this.points = {
    perm: this.points.perm
  }
  this._setBounds();
};

