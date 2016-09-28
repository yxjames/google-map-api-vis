var trueBounds;
var xdR, xdJ, qbR, qbJ;
var trueAddress;
var reverseOldLat, reverseOldLng;
function geocodeLatLng(geocoder, newLat, newLng) {
	reverseNewLat = parseFloat(newLat);
	reverseNewLng = parseFloat(newLng);
	if (reverseOldLat!=null && Math.abs(reverseNewLat-reverseOldLat) < 0.02 
		&& reverseOldLng != null && Math.abs(reverseNewLng-reverseOldLng) < 0.02) {
		trueBounds.setMap(map);
		//printDistrict(results[1].formatted_address, "TRUE");
	} else {
		var latlng = {lat: reverseNewLat, lng: reverseNewLng};
		geocoder.geocode({'location': latlng}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var result;
				for (var i = 0; i < results.length; i++) {
					//console.log(results[i]);
					if (results[i].types[0] == "sublocality_level_1") {
						result = results[i];
						break;
					}
				}
		      if (result) {
		        printDistrict(result.formatted_address, "TRUE");
		        console.log(result);
		        xdR = result.geometry.viewport.R.R;
		        xdJ = result.geometry.viewport.R.j;
		        qbR = result.geometry.viewport.j.R;
		        qbJ = result.geometry.viewport.j.j;
		        if (xdR > xdJ) {
		        	var temp = xdR;
		        	xdR = xdJ;
		        	xdJ = temp;
		        }
		        if (qbR > qbJ) {
		        	var temp = qbR;
		        	qbR = qbJ;
		        	qbJ = temp;
		        }
		        var square = [
		        	{lat: xdR, lng: qbR},
		        	{lat: xdJ, lng: qbR},
		        	{lat: xdJ, lng: qbJ},
		        	{lat: xdR, lng: qbJ},
		        	{lat: xdR, lng: qbR}
		        ];
		        trueBounds = new google.maps.Polygon({
		        	path: square,
		        	geodesic: true,
		        	strokeColor: '#FF0000',
		        	strokeOpacity: 0.8,
		        	strokeWeight: 1,
		        	fillColor: '#FF0000',
		        	fillOpacity: 0.3
		        });
		        trueBounds.setMap(map);
		      } else {
		        console.log("no result found");
		      }
		    } else {
		      console.log('Geocoder failed due to: ' + status);
		    }
		});
	}
	reverseOldLat = reverseNewLat;
	reverseOldLng = reverseNewLng;
}