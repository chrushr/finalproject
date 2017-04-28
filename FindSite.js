
// This fuction finds the new store location based on user inputs
var clickFindSite = function() {

  // Get the user input values and store them in variables f1 to f5 (these are more like positions)
  var f1 = $('#dropdown1').val()
  var f2 = $('#dropdown2').val()
  var f3 = $('#dropdown3').val()
  var f4 = $('#dropdown4').val()
  var f5 = $('#dropdown5').val()


  //F1-F5 are global variables. Assign "weights" from 1-4 to F1, F2, F3, and F4; and values of 1 or 3 to F5
  if (f1=="Population Characteristics"){
    F1 = '4'
  }
  else if (f2=="Population Characteristics"){
    F1 = '3'
  }
  else if (f3=="Population Characteristics"){
    F1 = '2'
  }
  else if (f4=="Population Characteristics"){
    F1 = '1'
  }


  if (f1=="Land Use"){
    F2 = '4'
  }
  else if (f2=="Land Use"){
    F2 = '3'
  }
  else if (f3=="Land Use"){
    F2 = '2'
  }
  else if (f4=="Land Use"){
    F2 = '1'
  }


  if (f1=="Parking"){
    F3 = '4'
  }
  else if (f2=="Parking"){
    F3 = '3'
  }
  else if (f3=="Parking"){
    F3 = '2'
  }
  else if (f4=="Parking"){
    F3 = '1'
  }


  if (f1=="Distance to Existing Supermarkets"){
    F4 = '4'
  }
  else if (f2=="Distance to Existing Supermarkets"){
    F4 = '3'
  }
  else if (f3=="Distance to Existing Supermarkets"){
    F4 = '2'
  }
  else if (f4=="Distance to Existing Supermarkets"){
    F4 = '1'
  }



  if (f5=="10000-30000 square feet"){
    F5 = '1'
  }
  else{
    F5 = '3'
  }


  // 'factors' is a global variable; change the value of 'factors' to a string of numbers (summing the five strings from F1 to F5)
  factors = F1+F2+F3+F4+F5

  // empty the newpoint array (global variable) each time this function is called
  newpoint = []

  // 'newpoints' is pre-generated data for all 13 unique locations; based on user inputs, push the matching data into the newpoint array
  if (factors == '21341'){
    newpoint.push(newpoints.features[0])
  }
  else if (factors == '13241'){
    newpoint.push(newpoints.features[1])
  }
  else if (factors == '14231'){
    newpoint.push(newpoints.features[2])
  }
  else if (factors == '43211'|| factors == '43121'|| factors == '13421'){
    newpoint.push(newpoints.features[3])
  }
  else if (factors == '24311'|| factors == '14321'){
     newpoint.push(newpoints.features[6])
  }
  else if (factors == '43213'|| factors == '43123'|| factors == '13423'){
     newpoint.push(newpoints.features[8])
  }
  else if (factors == '24313'|| factors == '14323'){
     nnewpoint.push(newpoints.features[11])
  }
  else if (factors == '41323'|| factors == '31423'|| factors == '31243'|| factors == '24133'|| factors == '21433'|| factors == '12433'|| factors == '12343'){
     newpoint.push(newpoints.features[13])
  }
  else if (factors == '24131'|| factors == '21431'|| factors == '12431'){
     newpoint.push(newpoints.features[20])
  }
  else if (factors == '41321'|| factors == '31421'|| factors == '31241'|| factors =='12341'){
     newpoint.push(newpoints.features[23])
  }
  else if (factors == '42311'|| factors == '42131'|| factors == '41231'|| factors == '34211'|| factors == '34121'|| factors == '32411'|| factors == '32141'|| factors == '23411'|| factors == '23141'){
     newpoint.push(newpoints.features[27])
  }
  else if (factors == '42313'|| factors == '42133'|| factors == '41233'|| factors == '34213'|| factors == '34123'|| factors == '32413'|| factors == '32143'|| factors == '23413'|| factors == '23143'|| factors == '21343'|| factors == '13243'){
     newpoint.push(newpoints.features[36])
  }
  else if (factors == '14233'){
     newpoint.push(newpoints.features[47])
  }

  // make a marker for the selected new store location
  var NewMarker= makeNewMarker(newpoint)

  // if there are stuff showing on the current layer, remove the current layer
  if(newMarkerArray.length){
        removeMarkers(newMarkerArray);
        newMarkerArray=[];
  }

  // plot the selected markers (supermarket groups), and push the result into the newMarkerArray
  newMarkerArray.push (plotNewMarker(NewMarkers));

}
