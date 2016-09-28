var map;
var markers = [];
var curMarker = {};
var device_id;
var innerKey = {};
var strokeColor = ['#FF000', '#4888D8', '#4B8312']
var index = [];
var interval = 0;
var curSpotId;
var prevSpotId;
var prevId;
var canvas;
var spots;
var x;
var start = 0;
var end = 0;
var animate = 0;

var geocoder;
function initMap() {
  $.ajax({
    url: 'http://0.0.0.0:8000/row',
    type: "GET",
    success: function(row_num) {
      
      var num = row_num["row"];
      end = num;
      interval = Math.ceil(num/1);
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
      getAllRecords(start, end);
    },
    error: function(error) {
      alert(JSON.stringify(error));
    }
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

function createCircle(type) {
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    fillColor: strokeColor[type],
  };
  return circle;
}


function createTrackingLine(oldPos, nextPos, circle, type) {
  var color = strokeColor[type];
  return new google.maps.Polyline({
    strokeColor: color,
    strokeOpacity: 1,
    strokeWeight: 0,
    path: [oldPos, nextPos],
    icons: [{
      icon: circle,
      offset: '0%'
    }],
    map: map
  });
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
  }
}

function drawTimeLine() {
  var width = 1100;
  var height = 200;
  $("#panel").css("display", "block");
  $("#back_btn").show();

  drawtimeLine(record);

}

function zoomed() {
  svg.select(".x.axis").call(xAxis);
}

function highlight(i) {
  curSpotId = i;
  canvas.append("circle")
        .attr("class", "mark")
        .attr("cx", x(new Date(Number(record[0][i].split(';')[0])))-1)
        .attr("cy", 55)
        .attr("r", 10)
        .attr("fill", "#FF0000")
        .attr("id", "idlabel_"+(++prevId));
  if (prevSpotId > 0) {
    canvas.select("#idlabel_"+(prevId-1)).remove();
  } else {
    prevSpotId = 1;
  }
}


$("#back_btn").click(function() {
  clearInterval(innerKey);
  innerKey = null;
  animate = 0;
  for (var idx = 0; idx < track.length; ++idx) {
    track[idx].setMap(null);
  }
  for (var idx = 0; idx < curMarker.length; ++idx) {
    curMarker[idx].setMap(null);
  }
  for (var idx = 0; idx < multiPolyline.length; idx++) {
    var polylines = multiPolyline[idx];
    for (var i = 0; i < polylines.length; ++i) {
      polylines[i].setMap(null);
    }
    polylines = []
    
  }
  multiPolyline = []
  d3.select("svg").remove();
  record = {};
  index = {};
  map.setZoom(5);
  $("#back_btn").hide();
  $("#before_btn").hide();
  $("#next_btn").hide();
  // $("#panel").hide();
  $("#step").hide();
  document.getElementById("next_btn").disabled = false;
  document.getElementById("before_btn").disabled = false;
  setMapOnAll(markers, map);
});
