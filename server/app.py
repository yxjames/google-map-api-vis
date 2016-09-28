from flask import Flask, jsonify, request
import json
from flask.ext.cors import CORS
import random
app = Flask(__name__)
cors = CORS(app)


neighbors = open('nhbr_id.csv').readlines()
events = open('sample-100-event-sequence').readlines()
timestamps = open('sample-100-time-sequence').readlines()
bases = open('nhbr').readlines()
latlngs = open('fake_latlng').readlines()
row_num = len(latlngs)

fake_events = open('fake-100-event-sequence').readlines()
fake_timestamps = open('fake-100-time-sequence').readlines()
fake_latlngs = open('fake_fake_latlng').readlines()

def getNeighborInfo(eventId):
	event_id = int(eventId)
	neighbor = bases[event_id-1].strip().split(',')
	return neighbor[2]+';'+neighbor[1]+';'+neighbor[0]

firstTimeLatLng = {str(i) : latlngs[i].split('\t')[0]+';'+
							timestamps[i].split(' ')[0]+';'+
							latlngs[i].split('\t')[1]+ ';'+
							events[i].split(' ')[0]+';'+
							getNeighborInfo(events[i].split(' ')[0]) for i in range(row_num)}
@app.route("/")
def hello():
    return "Yuxuan Hello World!"

@app.route("/row", methods=['GET'])
def getRowNum():
	print row_num
	return jsonify({"row":str(row_num)})

@app.route("/init", methods=['GET'])
def initMap():
	start = request.args.get('start')
	end = request.args.get('end')
	print start + "  " + end
	return jsonify({str(i) : firstTimeLatLng[str(i)] for i in range(int(start), int(end)+1)})


@app.route("/marker", methods=['GET'])
def getOneRow():
	line_num = int(request.args.get('id'))
	print line_num
	latlng_records = latlngs[line_num].strip().split('\t')[1:]
	timestamp = timestamps[line_num].strip().split(' ')
	event = events[line_num].strip().split(' ')
	records = [timestamp[i]+';'+latlng_records[i]+';'+event[i]+';'+getNeighborInfo(event[i]) for i in range(len(latlng_records))]

	pred_latlng_records = fake_latlngs[line_num].strip().split('\t')[1:]
	pred_timestamp = fake_timestamps[line_num].strip().split(' ')
	pred_event = fake_events[line_num].strip().split(' ')
	pred_records = [pred_timestamp[i]+';'+pred_latlng_records[i]+';'+pred_event[i]+';'+getNeighborInfo(pred_event[i]) for i in range(len(pred_latlng_records))]
	
	return jsonify({"real":records, "predict":pred_records})


if __name__ == "__main__":
    app.run(
    	host="0.0.0.0",
    	port=int("8000"),
    	
    )
