var record;
function createInitMarkers(data_response) {
	first_data = data_response;
	mapCenter = new google.maps.LatLng(40.6266603, -73.8);
	var options = {
		center: mapCenter,
		zoom: 10
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), options);
	var count = start;

	while (count < end) {  

		var instance = first_data[count].replace(/\n+/g, "").split(';');
		var id = instance[0];
		var timestamp = instance[1];
		var lat = Number(instance[2]);
		var lng = Number(instance[3]);
		var location = new google.maps.LatLng(lat, lng);
		getOneRecords(id, timestamp, location);

		count+=1;
	}
	$("#panel").hide();
	$("#back_btn").hide();
	$("#before_btn").hide();
	$("#next_btn").hide();
	$("#step").hide();
	$("#time-line").hide();

	setMapOnAll(markers, map);
}

function createFirstMarker(data_response, id) {
	var real_record = data_response["real"];
	console.log(data_response);
	var pred_record = data_response["predict"];
	record = {};
	record[0] = real_record;
	record[1] = pred_record;
	prevId = real_record.length;
	clearMarkers();
	
	for (var i in record) {
		index[i] = 0;
		createMarker(id, 0, i);

	}
	drawTimeLine();
	add_btn();
	console.log(index);
	printDate(Number(record[0][index[0]].split(';')[0])*1000);
	$("#time-line").css("display", "block");
	$("#ply_panel").css("display", "block");
	// $("#prv_panel").css("display", "block");
	// $("#next_panel").css("display", "block");
	$("#info_panel").css("display", "block");
}

function createMarker(device_id, i, type) {
  if (!jQuery.isEmptyObject(curMarker)) {
    for (var key in curMarker) {
      curMarker[key].setMap(null);
    }
  }
  var curData  =record[type][i].replace('/\n/g', "").split(';');
  var timestamp = curData[0];
  var position = new google.maps.LatLng(curData[1], curData[2]);
  var marker = new google.maps.Marker({
    position: position,
    id: device_id,
    curTime: timestamp,
    map: map
  });
  if (type == 0) {
  	map.setCenter(position);
  }
  curMarker[type] = marker;
  animate = 0;
}