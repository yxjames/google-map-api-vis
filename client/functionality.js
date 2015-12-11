var oneTrack = [];
var index = -1;
var markers = [];
var currentMarker = [];
var start = 0;
var end = 0;
var interval = 0;
var step = Number(document.getElementById("step").value);
var first_data = {};
function initMap() {
  $.ajax({
    url: 'http://0.0.0.0:8000/row',
    type: "GET",
    success: function(row_num) {
      var num = row_num["row"];
      interval = Math.ceil(num/10);
      var select = document.getElementById("interval");
      end = start + interval-1;
      var i = 1;
      while (i <= 10) {
        var thisEnd = end+1+(i-1)*interval;
        if (thisEnd > num) {
          thisEnd = num;
        }
        var txt = start+1+(i-1)*interval + "~" + thisEnd;
        $('#interval')
          .append($('<option>', {"value":txt})
          .text(txt)); 
        i+=1;
      }
      create();
    },
    error: function(error) {
      alert(JSON.stringify(error));
    }
  });
  
  
}

var map;
function create() {
  //console.log(start);
  //console.log(end);
  $.ajax({
        url: 'http://0.0.0.0:8000/init',
        type: "GET",
        dataType: "json",
        data: {"start":start, "end":end},
        success: function (data_response) {
          //console.log(data_response)
          first_data = data_response;
          mapCenter = new google.maps.LatLng(30.31266603, 120.33854487);
          var options = {
            center: mapCenter,
            zoom: 5
          };

          map = new google.maps.Map(document.getElementById('map-canvas'), options);
          var count = start;
          //alert("This is a visualization of taxi user data");
          while (count < end) {  

            var instance = first_data[count].replace(/\n+/g, "").split(';');
            var id = instance[0];
            var timestamp = instance[1];
            var lat = Number(instance[2]);
            var lng = Number(instance[3]);
            var location = new google.maps.LatLng(lat, lng);
            createMarker(id, timestamp, location);
            //console.log(">");
            count+=1;
          }
          $("#panel").hide();
          $("#back_btn").hide();
          $("#before_btn").hide();
          $("#next_btn").hide();
          $("#step").hide();
          document.getElementById("next_btn").disabled = false;
          document.getElementById("before_btn").disabled = true;
          setMapOnAll(markers, map);
        },
        error: function (error) {
          alert(JSON.stringify(error));
        }
      });
  

}

function createMarker(device_id, timestamp, location) {

  var marker = new google.maps.Marker({
    position: location,
    id: device_id,
    curTime: timestamp
  });

  markers.push(marker);
  marker.addListener('click', function() {
    $.ajax({
      url: 'http://0.0.0.0:8000/marker',
      type: "GET",
      data: {"id": device_id},
      success: function (data_response) {
        oneTrack = data_response["dummy"];              
        clearMarkers();
        changeView(marker);
      },
      error: function (error) {
        alert(JSON.stringify(error));
      }
    });
  });
}


function setMapOnAll(marks, map) {
  for (var i = 0; i < marks.length; i++) {
    marks[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(markers, null);
}

function pushIn(ind) {
  var lat;
  var lng;
  var data = oneTrack[ind].replace(/\n/g, "").split(';');
  var timestamp = data[0];
  lat = data[1];
  lng = data[2];
  var newMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,lng),
    id: "",
    curTime: timestamp
  });
  currentMarker.push(newMarker);
}
function changeView(cur) {
  cur.setMap(null);
  if (index == -1) {
    pushIn(0);
    index=0;
  } else {
    while (index >= currentMarker.length) {
      pushIn(currentMarker.length);
    }
  }
  currentMarker[index].setMap(map);
  map.setCenter(currentMarker[index].getPosition());
  map.setZoom(12);
  $("#back_btn").show();
  $("#before_btn").show();
  $("#next_btn").show();
  $("#panel").show();
  $("#step").show();
  document.getElementById("next_btn").disabled = index+step >= oneTrack.length? true : false;
  document.getElementById("next_btn").value = "Next ("+(index+1)+"/"+oneTrack.length+")";
  document.getElementById("before_btn").value = "Before ("+(index+1)+"/"+oneTrack.length+")";
  changeInfo();
}

$("#back_btn").click(function() {
  for (var i = 0; i < currentMarker.length; i++) {
    currentMarker[i].setMap(null);
  }
  currentMarker = [];
  index = -1;
  step = 1;
  map.setZoom(5);
  map.setCenter(mapCenter);
  $("#back_btn").hide();
  $("#before_btn").hide();
  $("#next_btn").hide();
  $("#panel").hide();
  $("#step").hide();
  document.getElementById("next_btn").disabled = false;
  document.getElementById("before_btn").disabled = false;
  setMapOnAll(markers, map);
});

$("#next_btn").click(function() {
  var curmarker = currentMarker[index];
  index += step;
  changeView(curmarker);
  document.getElementById("before_btn").disabled = false;
  if (index >= oneTrack.length-step) {
    document.getElementById("next_btn").disabled = true;
  }
});


$("#before_btn").click(function() {
   
  currentMarker[index].setMap(null);
  index = index - step;
  //document.getElementById("ind").innerHTML = index;
  var newMarker = currentMarker[index];
  newMarker.setMap(map);
  map.setCenter(newMarker.getPosition());
  document.getElementById("next_btn").value = "Next ("+(index+1)+"/"+oneTrack.length+")";
  document.getElementById("before_btn").value = "Before ("+(index+1)+"/"+oneTrack.length+")";
  changeInfo();
  document.getElementById("next_btn").disabled = false;
  if (index - step < 0) {
    document.getElementById("before_btn").disabled = true;
  }
});


$("#interval").click(function() {
  var se = document.getElementById("interval").value.split('~');
  start = Number(se[0])-1;
  end = Number(se[1])-1;
  first_data = {};
  markers = [];

  create();
});


$("#step").click(function() {
  step = Number(document.getElementById("step").value);
  document.getElementById("next_btn").disabled = index + step >= oneTrack.length? true : false;
  document.getElementById("before_btn").disabled = index - step < 0? true : false;
});

function changeInfo() {
  document.getElementById("time").innerHTML = new Date(Number(currentMarker[index].curTime));
  var position = currentMarker[index].getPosition();
  var lat = position.lat();
  var lng = position.lng();
  var latSyb = lat > 0? "N" : "S";
  var latDeg = Math.floor(lat);
  var min = (lat-latDeg)*60;
  var latMin = Math.floor(min);
  var sec = (min-latMin)*60;
  var latSec = Math.round(sec);
  var lngSyb = lng > 0? "E" : "W";
  var lngDeg = Math.floor(lng);
  min = (lng-lngDeg)*60;
  var lngMin = Math.floor(min);
  sec = (min-lngMin)*60;
  var lngSec = Math.round(sec);
  document.getElementById("pos").innerHTML = latDeg+"\xB0"+latMin+"'"+latSec+"\""+latSyb+" "+lngDeg+"\xB0"+lngMin+"'"+lngSec+"\""+lngSyb;
}