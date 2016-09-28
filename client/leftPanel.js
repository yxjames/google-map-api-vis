function add_btn() {
	var panel_width = $(window).width();
	var width_attr = "width:" + parseInt($("#ply_panel").width()/2) +'px';
	//var width_attr = "width:" + "50" +'px';
	var $play = $("<a>", {id:"play_btn", class:"btn", style:width_attr});
	$play.text("Play");
	$play.click(function(){
		play();
	});
	$("#ply_p").append($play);
	$("#prev").click(function() {
		if (index[0] > 0) {
			index[0]--;
			createMarker(device_id, index[0]);
			printDate(Number(record[0][index[0]].split(';')[0])*1000);
			printAddress(record[0][index[0]].split(';')[1],record[0][index[0]].split(';')[2]);
			update_btn();
		}
	});
	$("#next").click(function() {
		if (index[0] < record[0].length-1) {
			index[0]++;
			createMarker(device_id, index[0]);
			update_btn();
			printDate(Number(record[0][index[0]].split(';')[0])*1000);
			printAddress(record[0][index[0]].split(';')[1],record[0][index[0]].split(';')[2]);
		}
	});

}

function play() {
	if (animate == 0) {
		animate = 1;
		for (var type in record) {
			drawTrajectory(record[type], type);
		}
		update_btn();
	}
}

function stopMove() {
	if (animate == 1) {
		animate = 0;
        $("#play_btn").text("Play");
        update_btn();
        createMarker(curMarker[0].get("id"), index[0]+1, 0);
	}
}

function update_btn() {
	$("#play_btn").text( animate == 0? 'Play':'Pause');
	if (animate == 0) {
		$("#prv_p").show();
		$("#next_p").show();
		$("#play_btn").click(function() {play()});
	} else {
		$("#prv_p").hide();
		$("#next_p").hide();
		$("#play_btn").click(function() {stopMove()});
	}
	
}

function printDate(unix_date, type) {
	//console.log(unix_date);
	var a = new Date(unix_date);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var days = ['Mon', 'Tue','Wed','Thu','Fri','Sat','Sun'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	date = date > 9 ? date : "0" + date;
	var day = days[a.getDay()];
  	var hour = a.getHours();
  	hour = hour > 9 ? hour : "0" + hour;
  	var min = a.getMinutes();
  	min = min > 9 ? min : "0" + min;
  	var sec = a.getSeconds();
  	sec = sec > 9 ? sec : "0" + sec;
  	if (type == 0) {
  		$("#true_date").text(day+" "+date+", "+month+" "+year);
  		$("#true_time").text(hour+":"+min+":"+sec);
  	} else {
  		$("#pred_date").text(day+" "+date+", "+month+" "+year);
  		$("#pred_time").text(hour+":"+min+":"+sec);
  	}
  	

}

function printAddress(lat, lng) {
	
	$("#latlng").text(Number(lat).toFixed(2)+", "+Number(lng).toFixed(2));
}

function printNeighborhood(district, type) {
	if (type == 0) {
		$("#trueDistrict").text(district);
	} else {
		$("#predDistrict").text(district);
	}
}