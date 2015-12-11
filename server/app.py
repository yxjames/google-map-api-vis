from flask import Flask, jsonify, request
import json
from flask.ext.cors import CORS
app = Flask(__name__)
cors = CORS(app)

data = open('top100_taxi')

all_lines = data.readlines()
row_num = len(all_lines)
firstTimeLatLng = {str(i) : all_lines[i].split('\t')[0]+";"+all_lines[i].split('\t')[1] for i in range(row_num)}
all_dict = {all_lines[i].split('\t')[0] : {"dummy":all_lines[i].split('\t')[1:]} for i in range(row_num)}

json_first = json.dumps(firstTimeLatLng)
#print all_dict["2d92dbfe3376de09d8c3daa16c444c2d0"]

@app.route("/")
def hello():
    return "Yuxuan Hello World!"

@app.route("/row", methods=['GET'])
def getRowNum():
	return jsonify({"row":str(row_num)});

@app.route("/init", methods=['GET'])
def initMap():
	start = request.args.get('start')
	end = request.args.get('end')
	print start + "  " + end
	return jsonify({str(i) : firstTimeLatLng[str(i)] for i in range(int(start), int(end)+1)})


@app.route("/marker", methods=['GET'])
def getOneRow():
	device_id = request.args.get('id')
	print device_id
	return jsonify(all_dict[device_id]);



if __name__ == "__main__":
    app.run(
    	host="0.0.0.0",
    	port=int("8000"),
    	
    )
