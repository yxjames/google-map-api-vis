function getAllRecords(start, end) {
	$.ajax({
		url: 'http://0.0.0.0:8000/init',
		type: "GET",
		dataType: "json",
		data: {"start":start, "end":end},
		success: function (data_response) {
			createInitMarkers(data_response);
		},
		error: function (error) {
			alert(JSON.stringify(error));
		}
	});
}

function getOneRecords(id, timestamp, location) {
	var marker = new google.maps.Marker({
	    position: location,
	    id: id,
	    curTime: timestamp
	});

	geocoder = new google.maps.Geocoder;
  	markers.push(marker);
  	marker.addListener('click', function() {
  		$.ajax({
	      url: 'http://0.0.0.0:8000/marker',
	      type: "GET",
	      data: {"id": id},
	      success: function (data_response) {
	      	createFirstMarker(data_response, id);
	      },
	      error: function(error) {
	      	alert(JSON.stringify(error));
	      }
  		});
  	});
}

