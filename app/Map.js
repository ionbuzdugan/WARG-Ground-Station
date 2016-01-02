//a wrapper around leaflet that configures it as well
var map_config=require('../config/map-config');
var path=require('path');
var MapDraw=require('./models/MapDraw');

var Map=function(L){
  var leaflet=L;//reference to the window leaflet object
  var map=null;

  //Set up paths
  var tiles_path=path.join(__dirname,'../assets/sat_tiles');
  var images_path=path.join(__dirname,'../assets/images');
  leaflet.Icon.Default.imagePath = path.join(__dirname,'../assets/leaflet');

  var base_layers={};
  var overlay_layers={};
 
  base_layers['Satellite']=leaflet.tileLayer(tiles_path+'/{z}/{x}/{y}.png', {
    maxZoom: 19
  });

  base_layers['Streets']=leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });

  base_layers['Google Satellite']=new leaflet.Google('SATELLITE');

  overlay_layers['Plane']=new leaflet.RotatedMarker(map_config.default_lat_lang, {
    icon: leaflet.icon({
      iconUrl: images_path+'/plane.png',
      iconSize: [30, 30]
    })
  });

  overlay_layers['Plane Trail']=new leaflet.Polyline([], {
      color: '#190019',
      opacity: 0.6,
      weight: 5,
      clickable: true,
  });

  var centerToPlaneButton=L.easyButton( 'icon ion-pinpoint', function(){
    if (overlay_layers['Plane']) {
      map.panTo(overlay_layers['Plane'].getLatLng());
    }
  });

  var measureControl = new L.Control.Measure({
    primaryLengthUnit: 'meters', 
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqkilometers', 
    secondaryAreaUnit: 'sqmeters',
    activeColor: '#ABE67E',
    completedColor: '#C8F2BE',
    units:{
      sqkilometers: {
        factor: 1e-6, // Required. Factor to apply when converting to this unit. Length in meters or area in sq meters will be multiplied by this factor.
        display: 'Sq. Kilometers', // Required. How to display in results, like.. "300 Meters (0.3 My New Unit)".
        decimals: 2 // Number of decimals to round results when using this unit. `0` is the default value if not specified.
      }
    }
  });
  
  this.createMap=function(id){
    map = leaflet.map(id,{
      center: map_config.default_lat_lang,
      zoom: 17,
      attributionControl: false,
      layers: [base_layers['Satellite'], overlay_layers['Plane'],overlay_layers['Plane Trail']] //the default layers of the map
    });

    //allow the user to turn on and off specific layers
    leaflet.control.layers(base_layers, overlay_layers).addTo(map);
    leaflet.control.mousePosition().addTo(map);
    map.addControl(centerToPlaneButton);
    map.addControl(measureControl);
    new MapDraw(leaflet).addTo(map); //adds draw controls to map
  };

  this.movePlane=function(lat,lng, heading){
    overlay_layers['Plane'].setLatLng([lat,lng]);
    overlay_layers['Plane'].angle = heading;
    overlay_layers['Plane'].update();
  };

  this.expandPlaneTrail=function(lat,lng){
    overlay_layers['Plane Trail'].addLatLng([lat,lng]);
  };

  this.clearPlaneTrail=function(){
    overlay_layers['Plane Trail'].setLatLngs([]);
  };

};

module.exports=Map;