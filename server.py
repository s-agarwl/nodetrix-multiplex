import predict
import os.path
from flask import Flask, request, json
from flask import render_template
from flask_cors import CORS, cross_origin
import numpy as np
import scipy as sp
import pickle
import math
import networkx as nx
import sys
from time import time
import copy
import os

# Helper function to convert NumPy types to Python native types
def convert_numpy_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(i) for i in obj]
    else:
        return obj

# Helper function to download data files from cloud storage (example only)
def get_data_file(file_path):
    """
    This is an example function that would download a file from cloud storage
    if it doesn't exist locally. In a real implementation, you would use
    boto3 for AWS S3, google-cloud-storage for GCS, etc.
    """
    local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_path)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    # If file doesn't exist locally, download it
    if not os.path.exists(local_path):
        # Example using AWS S3 (you would need to install boto3)
        # import boto3
        # s3 = boto3.client('s3')
        # s3.download_file('your-bucket-name', file_path, local_path)
        
        # For now, just print a message
        print(f"Would download {file_path} to {local_path}")
    
    return local_path

app = Flask(__name__)

@app.route('/help')
def tutorial():
    return render_template('tutorial.html')

@app.route('/')
def clusterings():
    return render_template('index.html')

@app.route('/applyLaplacian', methods=['GET','POST'])
@cross_origin()
def applyLaplacian():

	receivedMatrix = request.json["matrix"]
	
	length = len(receivedMatrix)

	X = [None] * length
	degreeMatrix = [0] * length
	for x in range(0,length):
		X[x] = [None] * length
		degreeMatrix[x] = [0] * length
		tempDegree = 0
		for y in range(0,length):
			X[x][y] = receivedMatrix[str(x)][str(y)]
			tempDegree = tempDegree + X[x][y]
		degreeMatrix[x][x] = tempDegree

	X = np.asarray(X)
	degreeMatrix = np.asarray(degreeMatrix)
	dInverse = np.linalg.inv(degreeMatrix)
	dInverseSquareRoot = sp.linalg.sqrtm(dInverse)

	laplacian = np.subtract(degreeMatrix, X)

	normalizedLaplacian = laplacian

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length

	for i in range(0, length):
		for j in range(0,length):
			returnMatrix[i][j] = normalizedLaplacian[i][j]

	a = {"message":"success", "matrix": returnMatrix}
	a = convert_numpy_types(a)
	return json.dumps(a)

@app.route('/power2', methods=['GET','POST'])
@cross_origin()
def power():

	receivedMatrix = request.json["matrix"]
	
	length = len(receivedMatrix)

	X = [None] * length
	for x in range(0,length):
		X[x] = [None] * length
		for y in range(0,length):
			X[x][y] = receivedMatrix[str(x)][str(y)]

	X = np.asarray(X)
	Xpower2 = np.linalg.matrix_power(X,2)

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length
		for j in range(0,length):
			returnMatrix[i][j] = Xpower2[i][j] + X[i][j];

	a = {"message":"success", "matrix": returnMatrix}
	a = convert_numpy_types(a)
	return json.dumps(a)

@app.route('/similarity', methods=['GET','POST'])
@cross_origin()
def similarity():

	DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static/server_services/pythondata_infovis2015")
	
	receivedIds = request.json["ids"]
	matrixType = request.json["matrixType"]
	length = len(receivedIds)
	print(receivedIds)

	X = [None] * length
	for x in range(0,length):
		X[x] = [None] * length	

	dict_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "dictGlobalIDAuthorName.p"))
	dictGlobalIDAuthorName = pickle.load(open(dict_file_path, "rb"))

	if matrixType == 'coauthor':
		matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-authorship_dictionary_matrix.p"))
		dictMatrix = pickle.load(open(matrix_file_path, "rb"))
		
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print(X)
		print(matrixType)
	elif matrixType == 'cocitation':
		matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-citation_authors_dictionary_matrix.p"))
		dictMatrix = pickle.load(open(matrix_file_path, "rb"))
		
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print(X)
		print(matrixType)
	elif matrixType == 'authortopic':
		matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "author_topic_dictionary_matrix.p"))
		dictMatrix = pickle.load(open(matrix_file_path, "rb"))
		
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print(X)
		print(matrixType)

	X = np.asarray(X)

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length

	for i in range(0, length):
		for j in range(0,length):
			returnMatrix[i][j] = X[i][j]

	a = {"message":"success", "matrix": returnMatrix}
	a = convert_numpy_types(a)
	return json.dumps(a)

port = os.getenv('VCAP_APP_PORT', '5000')
		
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(port), debug=True)