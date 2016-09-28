function drawtimeLine(raw_data) {
	// console.log(raw_data);
	var startTime = new Date(Number(raw_data[0][0].split(';')[0])*1000);
	var endTime = new Date(Number(raw_data[0][raw_data[0].length-1].split(';')[0])*1000);
	var count = 0;
	for (var key in raw_data) {
	    if (raw_data.hasOwnProperty(key)) {
	       ++count;
	    }
	}
	var height = count * 70 + 10;
	$("#time-line").height(height);
	var data = [];
	for (var type in raw_data) {
		entry = {name: type};
		var time_arr = [];
		for (var element of raw_data[type]) {
			time_arr.push(new Date(Number(element.split(';')[0])*1000));
		}
		entry.dates = time_arr;
		data.push(entry);
	}
	// for (var element of raw_data) {
	// 	time_arr.push(new Date(Number(element.split(';')[0])*1000));
	// }
	console.log(data);
	// var data = [{name: "Record", dates: time_arr}, {name: "a", dates: [startTime]}];
	var color = d3.scale.category20();
	var eventDropsChart = d3.chart.eventDrops()
	    .eventLineColor(function (datum, index) {
	        return "orange";
	    })
	    .start(startTime)
	    .end(endTime)
	    .width($('#time-line').width())
	    //.margin({top: 0, left: 0, bottom: 30, right: 0})
	    .eventClick(function (datum, i) {
	    	index = i;
	    	animate = 0;
	    	clearInterval(intervalKey);
	    	intervalKey = null;
	    	createMarker(curMarker.get("id"), i);
	    	var nextData = record[0][i].replace('/\n/g', "").split(';');
	    	printDate(Number(nextData[0])*1000);
	    	printAddress(nextData[1], nextData[2]);
	    	if (trueBounds) {
		        trueBounds.setMap(null);
		    }
		    //geocodeLatLng(geocoder, nextData[1], nextData[2]);
	    });

	// bind data with DOM
	var element = d3.select("#time-line").datum(data);

	// draw the chart
	eventDropsChart(element);

}
