var countPercent = {};
var temp_pos = {};
function createPolylines(type) {
  return new google.maps.Polyline({
    strokeColor: '#800',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}
function calculateZoomFactor(oldLat, oldLng, nexLat, nextLng){
  var maxDiff = Math.max(Math.abs(nexLat- oldLat), 
    8*Math.abs(nextLng - oldLng));
  var zoom_factor = 17;
  var diff = 0.006;
  while (maxDiff > diff) {
    diff = diff * 2;
    zoom_factor = zoom_factor - 1;
  }
  if (zoom_factor > 12) {
    zoom_factor = 12;
  }
  return 14;
}
function createSmallInterval(f, delta_lat, delta_lng, type, next, looptime, track, polyline, range, interval) { 
  return setInterval(function() { 
    f(delta_lat, delta_lng, type, next, looptime, track, polyline, range); 
  }, interval);
}

function updateOldNextData(oldNextData, nextData) {
  oldNextData.nextLat = nextData[1];
  oldNextData.nextLng = nextData[2];
  oldNextData.nextTimeStamp = Number(nextData[0])*1000;
  oldNextData.nextNeighborId = nextData[3];
  oldNextData.nextNeighborName = nextData[4];
  oldNextData.nextNeighborLat = nextData[5];
  oldNextData.nextNeighborLng = nextData[6];
  return oldNextData;
}
function move(delta_lat, delta_lng, type, oldNextData, loop, track, polyline, range) {
  var icons = track.get('icons');
  if (icons.length == 1) {
    countPercent[type]++;
    var path = polyline.getPath();
    var pos = temp_pos[type];
    var newpos = new google.maps.LatLng(pos.lat()+delta_lat, pos.lng()+delta_lng);
    path.push(newpos);
    if (path.getLength() > 400) {
      path.removeAt(0);
    }
    polyline.setPath(path);
    icons[0].offset = (countPercent[type]) + '%';
    track.set('icons', icons);
    if (type == 0) {
      map.setCenter(newpos);
    }
    
    temp_pos[type] = newpos;
  }
  
  if (countPercent[type] == 100) {
    clearInterval(innerKey[type]);
    innerKey[type] = null;
    track.icons = [];
    oldNextData.oldLat = oldNextData.nextLat;
    oldNextData.oldLng = oldNextData.nextLng;
    oldNextData.oldTimeStamp = oldNextData.nextTimeStamp;

    nextData = record[type][index[type]+1].replace('/\n/g', "").split(';');
    oldNextData = updateOldNextData(oldNextData, nextData);

    var nTime = oldNextData.nextTimeStamp-oldNextData.oldTimeStamp;
    compressed_time = Math.floor(nTime/1000);
    if (animate == 1 && loop > index[type]+1){
      oneRoundMove(oldNextData, loop, type, compressed_time, track, polyline, range);
    } else {
      if (range != null) {
        range.setMap(null);
        range = null;
      }
      if (polyline != null) {
        polyline.setMap(null);
        polyline = null;
      }
    }
  }
}
function oneRoundMove(oldNextData, loop, type, compressed_time, track, polyline, range) {
  if (innerKey[type] == null) {
    printDate(oldNextData.nextTimeStamp, type);
    printAddress(oldNextData.nextLat, oldNextData.nextLng);
    printNeighborhood(oldNextData.nextNeighborName, type);
    var nextPos = new google.maps.LatLng(oldNextData.nextLat, oldNextData.nextLng);
    var delta_lat = (oldNextData.nextLat-oldNextData.oldLat)/100;
    var delta_lng = (oldNextData.nextLng - oldNextData.oldLng)/100;
    var oldPos = new google.maps.LatLng(oldNextData.oldLat, oldNextData.oldLng);
    temp_pos[type] = oldPos;
    if (type == 0) {
      map.setCenter(oldPos);
    }
    
    var rangeCenter = {
      lat: parseFloat(oldNextData.nextNeighborLat),
      lng: parseFloat(oldNextData.nextNeighborLng),
    };
    if (range != null) {
      range.setCenter(rangeCenter);
    } else {
      range = new google.maps.Circle({
        strokeColor: strokeColor[type],
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: strokeColor[type],
        fillOpacity: 0.35,
        map: map,
        center: rangeCenter,
        radius: 2000
      });
    }

    innerKey[type] = null;
    
    var innerTime = Math.floor(compressed_time/100);
    if (track == null || track.get('icons').length == 0) {
      track = createTrackingLine(oldPos, nextPos, createCircle(type), type);
      countPercent[type] = 0;
      innerKey[type] = createSmallInterval(move, delta_lat, delta_lng, type, oldNextData, loop, track, polyline, range, innerTime);
      index[type]++;
    }
  }
  if (index[type]+1 == loop) {
    animate = 0;
    index[type]--;
  }
}

function drawTrajectory(rec, type) {
  curMarker[type].setMap(null);
  var polyline = createPolylines(type);
  var loop = rec.length;
  polyline.setMap(map);
  
  var oldNextData = {
    oldLat: rec[index[type]].split(';')[1],
    oldLng: rec[index[type]].split(';')[2],
    oldTimeStamp: Number(rec[index[type]].replace('/\n/g', "").split(';')[0])*1000,
  };
  oldNextData = updateOldNextData(oldNextData, rec[index[type]+1].replace('/\n/g', "").split(';'));
  polyline.getPath().push(new google.maps.LatLng(oldNextData.oldLat, oldNextData.oldLng));
  var nTime = oldNextData.nextTimeStamp-oldNextData.oldTimeStamp;
  var compressed_time = Math.floor(nTime/1000);
  oneRoundMove(oldNextData, loop, type, compressed_time, null, polyline, null);
}