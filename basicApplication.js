/* ==============================================
Final Project - Tianyi Ren

This project/tool proposes suitable sites for a new store of Whole Foods Supermarket in San Francisco,
considering the store’s features, the various factors affecting the store’s success, and the potential
customer population for both the store itself and the competitor stores.

==================================================
(User Manual) The tool has the following features:

1. Show/Hide Stores (markers)
  a. Click on "Next" & "Previous" button to see each of the Whole Foods stores
  b. Click on "Show All" to see all stores, and clicke on "Clear All" to remove all stores

2. Siting new store
  a. Rank the four factors based on their importance levels, and select a store size range,
     then click "Add New Store", a new marker will be added to the map
  b. Change ranking and other inputs to add new locations on the map (removing the current one)
  c. Click "Remove New Store" to remove the new store

3. View Customer Distribution
  a. When no new stores on the map: hovering on an existing supermarket marker (yellow) will create
     a map of the current customer population of this store. The user can see the specific values
     by hovering on the census tracts.
  b. When a new store is added: hovering on the existing store marker (yellow) will create a map
     of the changes in the customer population of this store. The user can see the specific values
     by hovering on the census tracts.
  c. When a new store is added: clicking on the existing store marker (yellow) will create a map
     of the percentage (of the total population shopping at all 7 stores (6 existing + 1 new))
     change of the customers at this store. The user can see the specific values by hovering on
     the census tracts.
  d. When a new store is added: hovering on the new store marker (red) will create a map of the
     changes in customer population (from 0 to current value) of the new store. The user can see
     the specific values by hovering on the census tracts.
  e. When a new store is added: clicking on the new store marker (red) will create a map of the
     customer population of the new store as a percentage of the total population shopping at all
     7 stores (6 existing + 1 new). The user can see the specific values by hovering on the census
     tracts.


========================================================= */

// Define data to be used later in "clickNextButton" and “clickPreviousButton” functions
var state = {
  "slideNumber": 0, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.

  "slideData": [    // I edit the JSON data to be an array of three arrays, each containing information about a supermaket chain
                    {
                      "Name": "Whole Foods",
                      "Address": "399 4th St",
                      "LAT": 37.781091,
                      "LNG": -122.399748,
                      "POST": 94107,
                      "Neighborhood": "South Beach,South Of Market"
                    },
                    {
                      "Name": "Whole Foods",
                      "Address": "1150 Ocean Ave",
                      "LAT": 37.723811,
                      "LNG": -122.454773,
                      "POST": 94112,
                      "Neighborhood": "Potrero District,Potrero Flats"
                    },
                    {
                      "Name": "Whole Foods",
                      "Address": "3950 24th St",
                      "LAT": 37.751776,
                      "LNG": -122.430862,
                      "POST": 94114,
                      "Neighborhood": "Dolores Heights,Noe Valley"
                    },
                    {
                       "Name": "Whole Foods",
                       "Address": "2001 Market St",
                       "LAT": 37.768878,
                       "LNG": -122.426918,
                       "POST": 94114,
                       "Neighborhood": "Duboce Triangle,Lower Haight,Mission Dolores"
                     },
                     {
                       "Name": "Whole Foods",
                       "Address": "1765 California St",
                       "LAT": 37.790035,
                       "LNG": -122.423347,
                       "POST": 94109,
                       "Neighborhood": "Cathedral Hill,Laguna Heights,Little Osaka,Pacific Heights,Polk Gulch,Van Ness"
                     },
                     {
                       "Name": "Whole Foods",
                       "Address": "450 Rhode Island St",
                       "LAT": 37.76435,
                       "LNG": -122.402771,
                       "POST": 94107,
                       "Neighborhood": "Potrero District,Potrero Flats"
                     }
                ]
}

// Set map center and initial zoom scale
var map = L.map('map', {
  center: [ 37.7582, -122.459],
  zoom: 12
});

// Set base map (tile) style
var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//hide the "previous" button at the beginning
document.getElementById("previous").style.visibility="hidden"

//Define a marker style for the existing markers
var existingIcon = L.icon({
            	    iconUrl: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/128/Map-Marker-Marker-Inside-Chartreuse-icon.png',
                  iconSize: [45, 45],
                  shadowAnchor: [7, 40],
         });

//Define a marker style for the new markers
var newIcon = L.icon({
           	    iconUrl: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/128/Map-Marker-Marker-Inside-Pink-icon.png',
                 iconSize: [45, 45],
                 shadowAnchor: [7, 40],
        });


//============================================================

// Define Global Variables to be used later
var cartoUserName = 'chrushr';
var existingcensusArray=[];
var existingcensusLayer;
var markers= [];
var layer = [];
var NewMarkers = [];
var newlocationcensusArray = [];
var newlocationLayer;
var allmarkersLayer, allmarkersArray
var newpoint2 = newpoints.features[3]
var newpoint = []
var newMarkerArray = []
var factors
var F1, F2, F3, F4, F5

//============================================================


// This function allows showing the existing stores one by one by clikcing the 'next' button.
var clickNextButton = function() {
  if (state.slideNumber+1 > state.slideData.length ||state.slideNumber+1>6 ){
    state.slideNumber = 0
    document.getElementById("next").style.visibility="hidden"
  }
  else {
    state.slideNumber = state.slideNumber+1
  }
  var store= state.slideData[state.slideNumber];
  document.getElementById("previous").style.visibility="visible"
  var markers = makeMarkers(store); //call function to make markers
  if(layer.length){                 // if there are stuff showing on the current layer, remove the current layer
      removeMarkers(layer);
      layer=[];
  }
  layer = plotMarkers(markers);     // plot the selected marker
}


// Similar to the "clickNextButton" function, this function allows showing the existing stores one by one by clikcing the 'previous' button.
var clickPreviousButton = function() {
  document.getElementById("next").style.visibility="visible"
  if (state.slideNumber-1 < 0){
    state.slideNumber = state.slideData.length-1
  }
  else{
    state.slideNumber = state.slideNumber-1
  }
  var store= state.slideData[state.slideNumber]; //select store groups (0,1,2) based on slide number
  var markers = makeMarkers(store); //call function to make markers
  if(layer.length){                 // if there are stuff showing on the current layer, remove the current layer
    removeMarkers(layer);
    layer=[];
  }
  layer = plotMarkers(markers);     // plot the selected markers (supermarket groups)
}


// This function makes markers for existing supermarkets
var makeMarkers = function(data) {
  var markers= [];
  console.log(data)
    markers.push(L.marker([data.LAT,data.LNG],{icon: existingIcon}));
  return markers;
};


// This function plots existing supermarkets' markers on the map and show maps when hovering on or clicking on the markers
var plotMarkers = function(markers) {
 return  _.map(markers, function(marker){
    return marker.addTo(map).on('mouseover', function onClick(e) {  // Add markers on the map and create maps of current customer population when hovering on these markers
      map.setZoom(13)

      if(existingcensusArray.length){               // if there is a choropleth map showing on the screen, remove it by emptying the layers
          map.removeLayer(existingcensusLayer);
          existingcensusArray=[];
      }
      if (newlocationcensusArray.length){           // if there is a choropleth map showing on the screen, remove it by emptying the layers
        map.removeLayer(newlocationLayer)
        newlocationcensusArray=[];
      }

      var markerlat = e.latlng.lat                  // get the marker's lat and lng

      if (newMarkerArray.length){                   // if there's a new store marker on the map
        $('.cartodb-legend.choropleth').remove()    // Remove the current legend and update the legend
        $('body').append('<div class="cartodb-legend choropleth"> <div class="legend-title" style="color:#284a59">Customer Population Change</div><div class="legend-title" id="number1">  </div><ul><li class="graph leg" style="border-radius: 0; border:none"><div class="colors"><div class="quartile" style="background-color:#08519c"></div><div class="quartile" style="background-color:#3182bd"></div><div class="quartile" style="background-color:#6baed6"></div><div class="quartile" style="background-color:#bdd7e7"></div><div class="quartile" style="background-color:#eff3ff"></div></div></li><p style="padding-top:5px">Large&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Small</p></ul></div>');

        marker.bindPopup('Hover on the census tracts to see the exact values!')
        // Here are the 13 possible new store locations based on the 48 possible user input scenarios
        // Within each if/esle if statement, a different SQL is being called for each existing supermarket marker (there are six of them)
        // to 1)show a customer population change map of this particular store once the marker is hovered on
        //    2)show the exact value retained by each census tract on the legend when the census tracts are hovered on
        if (newpoint[0].properties.ID == '41321'|| newpoint[0].properties.ID == '31421'|| newpoint[0].properties.ID == '31241'|| newpoint[0].properties.ID=='12341'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }, {
              https: true
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_3 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_foo FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_1 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_5 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_2 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '21341'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '13241'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '14231'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '43211'|| newpoint[0].properties.ID == '43121'|| newpoint[0].properties.ID == '13421'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24311'|| newpoint[0].properties.ID == '14321'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '43213'|| newpoint[0].properties.ID == '43123'|| newpoint[0].properties.ID == '13423'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24313'|| newpoint[0].properties.ID == '14323'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '41323'|| newpoint[0].properties.ID == '31423'|| newpoint[0].properties.ID == '31243'|| newpoint[0].properties.ID == '24133'||newpoint[0].properties.ID == '21433'||newpoint[0].properties.ID == '12433'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '12343'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24131'|| newpoint[0].properties.ID == '21431'|| newpoint[0].properties.ID == '12431'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '42311'|| newpoint[0].properties.ID == '42131'|| newpoint[0].properties.ID == '41231'|| newpoint[0].properties.ID == '34211'||newpoint[0].properties.ID == '34121'||newpoint[0].properties.ID == '32411'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '32141'|| newpoint[0].properties.ID == '23411'|| newpoint[0].properties.ID == '23141'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '42313'|| newpoint[0].properties.ID == '42133'|| newpoint[0].properties.ID == '41233'|| newpoint[0].properties.ID == '34213'|| newpoint[0].properties.ID == '34123'|| newpoint[0].properties.ID == '32413'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '32143'|| newpoint[0].properties.ID == '23413'|| newpoint[0].properties.ID == '23143'|| newpoint[0].properties.ID == '21343'|| newpoint[0].properties.ID == '13243'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243{polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '14233'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,pwhole_f_4 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_f_4], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_4);
                $('#number1').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_3 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_f_3], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_3);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_foo FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_foo], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_foo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_foo);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_1 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_f_1], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_1);
                $('#number1').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_5 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_f_5], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_5);
                $('#number1').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, pwhole_f_2 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([pwhole_f_2], (#08519c, #3182bd, #6baed6, #bdd7e7, #eff3ff), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['pwhole_f_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.pwhole_f_2);
                $('#number1').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
      }
      else{                                         // if there's no new store marker on the map
          $('.cartodb-legend.choropleth').remove()  // Remove the current legend and update the legend
          $('body').append('<div class="cartodb-legend choropleth"> <div class="legend-title" style="color:#284a59">Customer Population Visiting This Store</div><div class="legend-title" id="number">  </div><ul><li class="graph leg" style="border-radius: 0; border:none"><div class="colors"><div class="quartile" style="background-color:#ecda9a"></div><div class="quartile" style="background-color:#f1b973"></div><div class="quartile" style="background-color:#f7945d"></div><div class="quartile" style="background-color:#f86f56"></div><div class="quartile" style="background-color:#ee4d5a"></div></div></li><p style="padding-top:5px">Small&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Large</p></ul></div>');

          marker.bindPopup('Add/Change new store to see customer changes for this supermarket!')

          // A different SQL is being called for each existing supermarket marker (there are six of them)
          // to 1)show a customer population map of this particular store once the marker is hovered on
          //    2)show the exact value retained by each census tract on the legend when the census tracts are hovered on
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
            user_name: cartoUserName,
            type: 'cartodb',
            interactivity: true,
            legends: true,
            sublayers: [
              {
                sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                cartocss: '#whole_origin {polygon-fill: ramp([w4], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                interactivity: ['w4'], // Define properties you want to be available on interaction
              }
            ]
            },{
              https: true
            }).on('done', function(layer) {
            existingcensusLayer=layer;
            map.addLayer(existingcensusLayer)
            layer.setInteraction(true)
            layer.on('featureOver',function(e, latlng, pos, data) {
              var print =Math.round(data.w4);
              $('#number').text(print)
            })
            });
          }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                  cartocss: '#whole_origin {polygon-fill: ramp([w3], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['w3'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.w3);
                $('#number').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                  cartocss: '#whole_origin {polygon-fill: ramp([w0], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['w0'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.w0);
                $('#number').text(print)

              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                  cartocss: '#whole_origin {polygon-fill: ramp([w1], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['w1'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.w1);
                $('#number').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                  cartocss: '#whole_origin {polygon-fill: ramp([w5], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['w5'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.w5);
                $('#number').text(print)

              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT d.* From (SELECT cartodb_id, the_geom_webmercator, whole_fo_5 * population as w5, whole_fo_4 * population as w4, whole_fo_3 * population as w3, whole_fo_2 * population as w2, whole_fo_1 * population as w1, whole_food * population as w0 FROM whole_origin) AS d',
                  cartocss: '#whole_origin {polygon-fill: ramp([w2], (#ecda9a, #f1b973, #f7945d, #f86f56, #ee4d5a), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['w2'], // Define properties you want to be available on interaction
               }
              ]
            },{
              https: true
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =Math.round(data.w2);
                $('#number').text(print)

              })
            });
          }

      }

      existingcensusArray.push(existingcensusLayer) // push the created layer into the existingcensusArray
    })
    .on('click',function onClick1(e){
                   // Create a different set of maps when clicking on these markers
      if(existingcensusArray.length){
          map.removeLayer(existingcensusLayer); // if there are stuff showing on the current layer, remove the current layer
          existingcensusArray=[];
      }              // if there is a choropleth map showing on the screen, remove it by emptying the layers
      if (newlocationcensusArray.length){
        map.removeLayer(newlocationLayer)
        newlocationcensusArray=[];
      }          // if there is a choropleth map showing on the screen, remove it by emptying the layers
      var markerlat = e.latlng.lat                  // get the marker's lat and lng
      if (newMarkerArray.length){                   // if there's a new store marker on the map, similar to line 146, using the same methods to visualize a diffrent column in the data
        $('.cartodb-legend.choropleth').remove()
        $('body').append('<div class="cartodb-legend choropleth"> <div class="legend-title" style="color:#284a59">Customer Percentage Change</div><div class="legend-title" id="number2">  </div><ul><li class="graph leg" style="border-radius: 0; border:none"><div class="colors"><div class="quartile" style="background-color:#6c2167"></div><div class="quartile" style="background-color:#a24186"></div><div class="quartile" style="background-color:#ca699d"></div><div class="quartile" style="background-color:#e498b4"></div><div class="quartile" style="background-color:#f3cbd3"></div></div></li><p style="padding-top:5px">Large&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Small</p></ul></div>');

        if (newpoint[0].properties.ID == '41321'|| newpoint[0].properties.ID == '31421'|| newpoint[0].properties.ID == '31241'|| newpoint[0].properties.ID=='12341'){
          if(markerlat == '37.790035'){
            // console.log('yes')
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, CAST (ptwhole__4 AS float)AS ptwhole_4 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_4], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              console.log(existingcensusLayer)
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_4;
                $('#number2').text(print)

              });
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, pwhole_f_5, pwhole_f_4, pwhole_f_3, pwhole_f_2, pwhole_f_1, pwhole_foo, CAST (ptwhole__5 AS float)AS ptwhole_5, CAST (ptwhole__4 AS float)AS ptwhole_4, CAST (ptwhole__3 AS float)AS ptwhole_3, CAST (ptwhole__2 AS float)AS  ptwhole_2, CAST (ptwhole__1 AS float)AS ptwhole_1, CAST (ptwhole_fo AS float)AS ptwhole_0 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_3;
                $('#number2').text(print)
              });
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, pwhole_f_5, pwhole_f_4, pwhole_f_3, pwhole_f_2, pwhole_f_1, pwhole_foo, CAST (ptwhole__5 AS float)AS ptwhole_5, CAST (ptwhole__4 AS float)AS ptwhole_4, CAST (ptwhole__3 AS float)AS ptwhole_3, CAST (ptwhole__2 AS float)AS  ptwhole_2, CAST (ptwhole__1 AS float)AS ptwhole_1, CAST (ptwhole_fo AS float)AS ptwhole_0 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_0], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_0'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_0;
                $('#number2').text(print)
              });
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, pwhole_f_5, pwhole_f_4, pwhole_f_3, pwhole_f_2, pwhole_f_1, pwhole_foo, CAST (ptwhole__5 AS float)AS ptwhole_5, CAST (ptwhole__4 AS float)AS ptwhole_4, CAST (ptwhole__3 AS float)AS ptwhole_3, CAST (ptwhole__2 AS float)AS  ptwhole_2, CAST (ptwhole__1 AS float)AS ptwhole_1, CAST (ptwhole_fo AS float)AS ptwhole_0 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_1], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_1;
                $('#number2').text(print)
              });
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, pwhole_f_5, pwhole_f_4, pwhole_f_3, pwhole_f_2, pwhole_f_1, pwhole_foo, CAST (ptwhole__5 AS float)AS ptwhole_5, CAST (ptwhole__4 AS float)AS ptwhole_4, CAST (ptwhole__3 AS float)AS ptwhole_3, CAST (ptwhole__2 AS float)AS  ptwhole_2, CAST (ptwhole__1 AS float)AS ptwhole_1, CAST (ptwhole_fo AS float)AS ptwhole_0 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_5;
                $('#number2').text(print)
              });
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id, the_geom_webmercator, pwhole_f_5, pwhole_f_4, pwhole_f_3, pwhole_f_2, pwhole_f_1, pwhole_foo, CAST (ptwhole__5 AS float)AS ptwhole_5, CAST (ptwhole__4 AS float)AS ptwhole_4, CAST (ptwhole__3 AS float)AS ptwhole_3, CAST (ptwhole__2 AS float)AS  ptwhole_2, CAST (ptwhole__1 AS float)AS ptwhole_1, CAST (ptwhole_fo AS float)AS ptwhole_0 FROM whole_origin_f12341',
                  cartocss: '#whole_origin_f12341 {polygon-fill: ramp([ptwhole_2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole_2;
                $('#number2').text(print)
              });
            });
          }
        }
        else if (newpoint[0].properties.ID == '21341'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f21341',
                  cartocss: '#whole_origin_f21341 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '13241'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f13241',
                  cartocss: '#whole_origin_f13241 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '14231'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f14231',
                  cartocss: '#whole_origin_f14231 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '43211'|| newpoint[0].properties.ID == '43121'|| newpoint[0].properties.ID == '13421'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f43211',
                  cartocss: '#whole_origin_f43211 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24311'|| newpoint[0].properties.ID == '14321'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f14321',
                  cartocss: '#whole_origin_f14321 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '43213'|| newpoint[0].properties.ID == '43123'|| newpoint[0].properties.ID == '13423'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f13423',
                  cartocss: '#whole_origin_f13423 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24313'|| newpoint[0].properties.ID == '14323'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f24313',
                  cartocss: '#whole_origin_f24313 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '41323'|| newpoint[0].properties.ID == '31423'|| newpoint[0].properties.ID == '31243'|| newpoint[0].properties.ID == '24133'||newpoint[0].properties.ID == '21433'||newpoint[0].properties.ID == '12433'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '12343'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f12343',
                  cartocss: '#whole_origin_f12343 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '24131'|| newpoint[0].properties.ID == '21431'|| newpoint[0].properties.ID == '12431'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f24131',
                  cartocss: '#whole_origin_f24131 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '42311'|| newpoint[0].properties.ID == '42131'|| newpoint[0].properties.ID == '41231'|| newpoint[0].properties.ID == '34211'||newpoint[0].properties.ID == '34121'||newpoint[0].properties.ID == '32411'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '32141'|| newpoint[0].properties.ID == '23411'|| newpoint[0].properties.ID == '23141'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f42311',
                  cartocss: '#whole_origin_f42311 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '42313'|| newpoint[0].properties.ID == '42133'|| newpoint[0].properties.ID == '41233'|| newpoint[0].properties.ID == '34213'|| newpoint[0].properties.ID == '34123'|| newpoint[0].properties.ID == '32413'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '32143'|| newpoint[0].properties.ID == '23413'|| newpoint[0].properties.ID == '23143'|| newpoint[0].properties.ID == '21343'|| newpoint[0].properties.ID == '13243'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f13243',
                  cartocss: '#whole_origin_f13243 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
        else if (newpoint[0].properties.ID == '14233'){
          if(markerlat == '37.790035'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator,ptwhole__4 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole__4],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__4'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {

              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print = data.ptwhole__4;
                $('#number2').text(print)
              })
            });
           }
          else if (markerlat == '37.781091'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__3 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole__3], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__3'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__3;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.768878'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole_fo FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole_fo], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole_fo'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole_fo;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.76435'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__1 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole__1],(#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3),quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__1'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__1;
                $('#number2').text(print)

              })
            });
          }
          else if (markerlat == '37.751776'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__5 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole__5], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__5'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__5;
                $('#number2').text(print)
              })
            });
          }
          else if (markerlat == '37.723811'){
            cartodb.createLayer(map, {
              user_name: cartoUserName,
              type: 'cartodb',
              interactivity: true,
              sublayers: [
                {
                  sql: 'SELECT cartodb_id,the_geom_webmercator, ptwhole__2 FROM whole_origin_f14233',
                  cartocss: '#whole_origin_f14233 {polygon-fill: ramp([ptwhole__2], (#6c2167, #a24186, #ca699d, #e498b4, #f3cbd3), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
                  interactivity: ['ptwhole__2'], // Define properties you want to be available on interaction
               }
              ]
            }).on('done', function(layer) {
              existingcensusLayer=layer;
              map.addLayer(existingcensusLayer)
              layer.setInteraction(true)
              layer.on('featureOver',function(e, latlng, pos, data) {
                var print =data.ptwhole__2;
                $('#number2').text(print)
              // layer.bindPopup(data.w4).openPopup();
              })
            });
          }
        }
      }
      else{}                                        // if there's no new store marker on the map do nothing
      existingcensusArray.push(existingcensusLayer) // push the created layer into the existingcensusArray
    })
 });
};


// This function removes markers on the map
var removeMarkers = function(marker) {
  _.each(marker,function(obj){
    map.removeLayer(obj);
  });
};


// This function makes new store markers
var makeNewMarker = function(array) {
  console.log(array)
  NewMarkers=[]
  NewMarkers.push(L.marker([array[0].geometry.coordinates[1],array[0].geometry.coordinates[0]],{icon: newIcon}));
  return NewMarkers;
};


// This function plots the new store marker on the map and show maps when hovering on or clicking on the markers
var plotNewMarker = function(marker) {
 return marker[0].addTo(map)                      // Add markers on the map
 .on('mouseover', function onClick(e) {           // Create maps of current customer population when hovering on the new marker
   map.setZoom(13)
   if(newlocationcensusArray.length){
       map.removeLayer(newlocationLayer); // if there are stuff showing on the current layer, remove the current layer
       newlocationcensusArray=[];
   }            // if there is a choropleth map showing on the screen, remove it by emptying the layers
   if(existingcensusArray.length){
       map.removeLayer(existingcensusLayer); // if there are stuff showing on the current layer of the exisitng supermarkets, remove the current layer
       existingcensusArray=[];
   }               // if there is a choropleth map showing on the screen, remove it by emptying the layers

   if (newMarkerArray.length){                    // if there's a new store marker on the map
     $('.cartodb-legend.choropleth').remove()   // Remove the current legend and update the legend
     $('body').append('<div class="cartodb-legend choropleth"> <div class="legend-title" style="color:#284a59">Customer Population Change</div><div class="legend-title" id="number1">  </div><ul><li class="graph leg" style="border-radius: 0; border:none"><div class="colors"><div class="quartile" style="background-color:#08519c"></div><div class="quartile" style="background-color:#3182bd"></div><div class="quartile" style="background-color:#6baed6"></div><div class="quartile" style="background-color:#bdd7e7"></div><div class="quartile" style="background-color:#eff3ff"></div></div></li><p style="padding-top:5px">Large&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Small</p></ul></div>');

     // Here are the 13 possible new store locations based on the 48 possible user input scenarios
     // Within each if/esle if statement, a different SQL is being called for each new supermarket marker
     // to 1)show a customer population map of this particular store once the marker is hovered on
     //    2)show the exact value retained by each census tract on the legend when the census tracts are hovered on
     if (newpoint[0].properties.ID == '41321'|| newpoint[0].properties.ID == '31421'|| newpoint[0].properties.ID == '31241'|| newpoint[0].properties.ID=='12341'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f12341',
             cartocss: '#whole_origin_f12341 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '21341'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f21341',
             cartocss: '#whole_origin_f21341 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '13241'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f13241',
             cartocss: '#whole_origin_f13241 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '14231'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f14231',
             cartocss: '#whole_origin_f14231 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '43211'|| newpoint[0].properties.ID == '43121'|| newpoint[0].properties.ID == '13421'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f43211',
             cartocss: '#whole_origin_f43211 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '24311'|| newpoint[0].properties.ID == '14321'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f14321',
             cartocss: '#whole_origin_f14321 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '43213'|| newpoint[0].properties.ID == '43123'|| newpoint[0].properties.ID == '13423'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f13423',
             cartocss: '#whole_origin_f13423 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '24313'|| newpoint[0].properties.ID == '14323'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f24313',
             cartocss: '#whole_origin_f24313 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '41323'|| newpoint[0].properties.ID == '31423'|| newpoint[0].properties.ID == '31243'|| newpoint[0].properties.ID == '24133'||newpoint[0].properties.ID == '21433'||newpoint[0].properties.ID == '12433'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f12343',
             cartocss: '#whole_origin_f12343 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '12343'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f12343',
             cartocss: '#whole_origin_f12343 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '24131'|| newpoint[0].properties.ID == '21431'|| newpoint[0].properties.ID == '12431'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f24131',
             cartocss: '#whole_origin_f24131 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '42311'|| newpoint[0].properties.ID == '42131'|| newpoint[0].properties.ID == '41231'|| newpoint[0].properties.ID == '34211'||newpoint[0].properties.ID == '34121'||newpoint[0].properties.ID == '32411'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f42311',
             cartocss: '#whole_origin_f42311 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '32141'|| newpoint[0].properties.ID == '23411'|| newpoint[0].properties.ID == '23141'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f42311',
             cartocss: '#whole_origin_f42311 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '42313'|| newpoint[0].properties.ID == '42133'|| newpoint[0].properties.ID == '41233'|| newpoint[0].properties.ID == '34213'|| newpoint[0].properties.ID == '34123'|| newpoint[0].properties.ID == '32413'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f13243',
             cartocss: '#whole_origin_f13243 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '32143'|| newpoint[0].properties.ID == '23413'|| newpoint[0].properties.ID == '23143'|| newpoint[0].properties.ID == '21343'|| newpoint[0].properties.ID == '13243'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f13243',
             cartocss: '#whole_origin_f13243 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
     else if (newpoint[0].properties.ID == '14233'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_or_1 FROM whole_origin_f14233',
             cartocss: '#whole_origin_f14233 {polygon-fill: ramp([whole_or_1], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_or_1'], // Define properties you want to be available on interaction
           }
         ]
       }).on('done', function(layer) {
         newlocationLayer=layer;
         map.addLayer(newlocationLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           console.log(data)
           var print = data.whole_or_1;
           $('#number1').text(print)
         })
       });
     }
   };

   newlocationcensusArray.push(newlocationLayer)  // push the created layer into the newlocationcensusArray
 })
 .on('click',function onClick1(e){                // Create a different map when clicking on the new marker
   if(existingcensusArray.length){
       map.removeLayer(existingcensusLayer); // if there are stuff showing on the current layer, remove the current layer
       existingcensusArray=[];
   }               // if there is a choropleth map showing on the screen, remove it by emptying the layers
   if (newlocationcensusArray.length){
     map.removeLayer(newlocationLayer)
     newlocationcensusArray=[];
   }           // if there is a choropleth map showing on the screen, remove it by emptying the layers
   if (newMarkerArray.length){                    // if there's a new store marker on the map
     $('.cartodb-legend.choropleth').remove()     // Remove the current legend and update the legend
     $('body').append('<div class="cartodb-legend choropleth"> <div class="legend-title" style="color:#284a59">Customer Percentage Change</div><div class="legend-title" id="number2">  </div><ul><li class="graph leg" style="border-radius: 0; border:none"><div class="colors"><div class="quartile" style="background-color:#6c2167"></div><div class="quartile" style="background-color:#a24186"></div><div class="quartile" style="background-color:#ca699d"></div><div class="quartile" style="background-color:#e498b4"></div><div class="quartile" style="background-color:#f3cbd3"></div></div></li><p style="padding-top:5px">Large&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Small</p></ul></div>');

     // Here are the 13 possible new store locations based on the 48 possible user input scenarios
     // Within each if/esle if statement, a different SQL is being called for each new supermarket marker
     // to 1)show a customer population percentage change map of this particular store once the marker is clicked on
     //    2)show the exact value retained by each census tract on the legend when the census tracts are hovered on
     if (newpoint[0].properties.ID == '41321'|| newpoint[0].properties.ID == '31421'|| newpoint[0].properties.ID == '31241'|| newpoint[0].properties.ID=='12341'){
         cartodb.createLayer(map, {
           user_name: cartoUserName,
           type: 'cartodb',
           interactivity: true,
           sublayers: [
             {
               sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f12341',
               cartocss: '#whole_origin_f12341 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
               interactivity: ['whole_orig'], // Define properties you want to be available on interaction
            }
           ]
         }).on('done', function(layer) {

           existingcensusLayer=layer;
           console.log(existingcensusLayer)
           map.addLayer(existingcensusLayer)
           layer.setInteraction(true)
           layer.on('featureOver',function(e, latlng, pos, data) {
             var print = data.whole_orig;
             $('#number2').text(print)
           });
         });
     }
     else if (newpoint[0].properties.ID == '21341'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f21341',
             cartocss: '#whole_origin_f21341 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '13241'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f13241',
             cartocss: '#whole_origin_f13241 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '14231'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f14231',
             cartocss: '#whole_origin_f14231 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '43211'|| newpoint[0].properties.ID == '43121'|| newpoint[0].properties.ID == '13421'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f43211',
             cartocss: '#whole_origin_f43211 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '24311'|| newpoint[0].properties.ID == '14321'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f14321',
             cartocss: '#whole_origin_f14321 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '43213'|| newpoint[0].properties.ID == '43123'|| newpoint[0].properties.ID == '13423'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f13423',
             cartocss: '#whole_origin_f13423 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '24313'|| newpoint[0].properties.ID == '14323'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f24313',
             cartocss: '#whole_origin_f24313 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '41323'|| newpoint[0].properties.ID == '31423'|| newpoint[0].properties.ID == '31243'|| newpoint[0].properties.ID == '24133'||newpoint[0].properties.ID == '21433'||newpoint[0].properties.ID == '12433'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f12343',
             cartocss: '#whole_origin_f12343 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '12343'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f12343',
             cartocss: '#whole_origin_f12343 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '24131'|| newpoint[0].properties.ID == '21431'|| newpoint[0].properties.ID == '12431'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f24131',
             cartocss: '#whole_origin_f24131 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '42311'|| newpoint[0].properties.ID == '42131'|| newpoint[0].properties.ID == '41231'|| newpoint[0].properties.ID == '34211'||newpoint[0].properties.ID == '34121'||newpoint[0].properties.ID == '32411'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f42311',
             cartocss: '#whole_origin_f42311 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '32141'|| newpoint[0].properties.ID == '23411'|| newpoint[0].properties.ID == '23141'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f42311',
             cartocss: '#whole_origin_f42311 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '42313'|| newpoint[0].properties.ID == '42133'|| newpoint[0].properties.ID == '41233'|| newpoint[0].properties.ID == '34213'|| newpoint[0].properties.ID == '34123'|| newpoint[0].properties.ID == '32413'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f13243',
             cartocss: '#whole_origin_f13243 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '32143'|| newpoint[0].properties.ID == '23413'|| newpoint[0].properties.ID == '23143'|| newpoint[0].properties.ID == '21343'|| newpoint[0].properties.ID == '13243'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f13243',
             cartocss: '#whole_origin_f13243 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
     else if (newpoint[0].properties.ID == '14233'){
       cartodb.createLayer(map, {
         user_name: cartoUserName,
         type: 'cartodb',
         interactivity: true,
         sublayers: [
           {
             sql: 'SELECT cartodb_id, the_geom_webmercator, whole_orig FROM whole_origin_f14233',
             cartocss: '#whole_origin_f14233 {polygon-fill: ramp([whole_orig],  (#f3cbd3, #e498b4, #ca699d, #a24186, #6c2167), quantiles);polygon-opacity: 0.75;line-width: 1;line-color:#FFF;line-opacity: 0.5;}',
             interactivity: ['whole_orig'], // Define properties you want to be available on interaction
          }
         ]
       }).on('done', function(layer) {

         existingcensusLayer=layer;
         console.log(existingcensusLayer)
         map.addLayer(existingcensusLayer)
         layer.setInteraction(true)
         layer.on('featureOver',function(e, latlng, pos, data) {
           var print = data.whole_orig;
           $('#number2').text(print)
         });
       });
     }
   }
   newlocationcensusArray.push(newlocationLayer)  // push the created layer into the newlocationcensusArray
 });
}


// Call function to execute the processes above when the 'Show All' button is clicked
$( '#all' ).click(
 function(){
   if(existingcensusArray.length){               // if there is a choropleth map showing on the screen, remove it by emptying the layers
       map.removeLayer(existingcensusLayer);
       existingcensusArray=[];
   }
   if (newlocationcensusArray.length){           // if there is a choropleth map showing on the screen, remove it by emptying the layers
     map.removeLayer(newlocationLayer)
     newlocationcensusArray=[];
   }
   removeMarkers(allmarkersLayer); // if there are stuff showing on the current layer of the exisitng supermarkets, remove the current layer
   allmarkersLayer=[];
   allmarkersArray = [];
   _.each(state.slideData,function(obj){
     console.log(obj)
   allmarkersArray.push(L.marker([obj.LAT,obj.LNG],{icon: existingIcon}));
   allmarkersLayer = plotMarkers(allmarkersArray)
 });
 }
)


// Call function to execute the processes above when the 'Clear All' button is clicked
$('#removeall').click(
  function(){
   removeMarkers(allmarkersLayer)
 }
)


// Call function to execute the processes above when the 'Next' button is clicked
$( '#next' ).click(
  function() {
  clickNextButton();
  }
)


// Call function to execute the processes above when the 'Previous' button is clicked
$( '#previous' ).click(
  function() {
  clickPreviousButton();
  }
)


// Call function to execute the processes above when the 'Add New Store' button is clicked
$( '#findsite' ).click(
  function() {
  clickFindSite();
  $('.cartodb-legend.choropleth').remove();
  }
)


// Call function to execute the processes above when the 'Remove New Store' button is clicked
$( '#removesite' ).click(
  function() {
  removeMarkers(newMarkerArray)
  newMarkerArray=[];
  $('.cartodb-legend1.choropleth1').remove();
  removeMarkers(allmarkersLayer); // if there are stuff showing on the current layer of the exisitng supermarkets, remove the current layer
  allmarkersLayer=[];
  allmarkersArray = [];
  _.each(state.slideData,function(obj){
    console.log(obj)
  allmarkersArray.push(L.marker([obj.LAT,obj.LNG],{icon: existingIcon}));
  allmarkersLayer = plotMarkers(allmarkersArray)
  });
  }
)
