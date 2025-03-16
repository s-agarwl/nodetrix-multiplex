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

# Import the check_files function
try:
    from check_files import check_files
except ImportError:
    # Define a simple version if the import fails
    def check_files():
        result = {"cwd": os.getcwd(), "directories": {}, "files": {}}
        
        # Check directories
        for directory in [".", "/var/task", "static", "static/server_services"]:
            if os.path.exists(directory):
                try:
                    result["directories"][directory] = os.listdir(directory)
                except:
                    result["directories"][directory] = "Error listing directory"
            else:
                result["directories"][directory] = "Does not exist"
        
        # Check files
        for file_path in ["static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p"]:
            if os.path.exists(file_path):
                result["files"][file_path] = f"Exists ({os.path.getsize(file_path)} bytes)"
            else:
                result["files"][file_path] = "Does not exist"
        
        return result

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

# Helper function to get data file paths correctly on different environments
def get_data_file(file_path):
    """
    This function handles file paths differently based on the environment:
    1. On Vercel: Uses absolute paths from /var/task
    2. In development: Uses paths relative to the script
    """
    # Check if running on Vercel
    if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'):
        # On Vercel, files are in /var/task
        local_path = os.path.join('/var/task', file_path)
        print(f"Vercel path: {local_path}")
    else:
        # Local development - use path relative to script
        local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_path)
        print(f"Local path: {local_path}")
    
    # Check if file exists
    if not os.path.exists(local_path):
        print(f"Warning: File not found: {local_path}")
        # List directory contents to debug
        parent_dir = os.path.dirname(local_path)
        if os.path.exists(parent_dir):
            print(f"Contents of {parent_dir}:")
            try:
                print(os.listdir(parent_dir))
            except Exception as e:
                print(f"Error listing directory: {str(e)}")
        
        # Try alternative paths on Vercel
        if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'):
            alt_paths = [
                # Try without /var/task prefix
                file_path,
                # Try with just the filename
                os.path.basename(file_path)
            ]
            
            for alt_path in alt_paths:
                if os.path.exists(alt_path):
                    print(f"Found file at alternative path: {alt_path}")
                    return alt_path
    
    return local_path

app = Flask(__name__)

@app.route('/debug/check-files')
def debug_check_files():
    """Debug endpoint to check file paths and existence."""
    try:
        result = check_files()
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e)})

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
    try:
        DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static/server_services/pythondata_infovis2015")
        
        receivedIds = request.json["ids"]
        matrixType = request.json["matrixType"]
        length = len(receivedIds)
        print(f"Processing similarity request for {length} IDs, matrix type: {matrixType}")

        X = [None] * length
        for x in range(0,length):
            X[x] = [None] * length	

        # Generate a default empty matrix in case of errors
        default_matrix = [[0 for _ in range(length)] for _ in range(length)]
        
        try:
            # List all files in the directory to debug
            if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'):
                vercel_dir = "/var/task/static/server_services/pythondata_infovis2015"
                if os.path.exists(vercel_dir):
                    print(f"Vercel directory exists: {vercel_dir}")
                    try:
                        print(f"Contents of {vercel_dir}:")
                        print(os.listdir(vercel_dir))
                    except Exception as e:
                        print(f"Error listing directory: {str(e)}")
                else:
                    print(f"Vercel directory does not exist: {vercel_dir}")
                    
                    # Try to find the directory
                    for root_dir in ['/var/task', '/tmp', '.']:
                        for dirpath, dirnames, filenames in os.walk(root_dir, topdown=True, followlinks=False):
                            if 'pythondata_infovis2015' in dirpath:
                                print(f"Found data directory: {dirpath}")
                                print(f"Contents: {filenames}")
                                break
            
            # Get the dictionary file path
            dict_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "dictGlobalIDAuthorName.p"))
            print(f"Attempting to load dictionary from: {dict_file_path}")
            
            # Check if file exists
            if not os.path.exists(dict_file_path):
                print(f"Dictionary file not found: {dict_file_path}")
                return json.dumps({"message":"error", "error": "Dictionary file not found", "matrix": default_matrix})
            
            # Load the dictionary
            try:
                dictGlobalIDAuthorName = pickle.load(open(dict_file_path, "rb"))
                print(f"Dictionary loaded successfully, contains {len(dictGlobalIDAuthorName)} entries")
            except Exception as e:
                print(f"Error loading dictionary: {str(e)}")
                return json.dumps({"message":"error", "error": f"Error loading dictionary: {str(e)}", "matrix": default_matrix})
            
            # Check if we have a valid dictionary
            if not dictGlobalIDAuthorName:
                print("Dictionary is empty")
                return json.dumps({"message":"error", "error": "Dictionary is empty", "matrix": default_matrix})
                
            # Process based on matrix type
            if matrixType == 'coauthor':
                matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-authorship_dictionary_matrix.p"))
                print(f"Loading co-authorship matrix from: {matrix_file_path}")
                
                if not os.path.exists(matrix_file_path):
                    print(f"Matrix file not found: {matrix_file_path}")
                    return json.dumps({"message":"error", "error": "Matrix file not found", "matrix": default_matrix})
                
                try:
                    dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                    print(f"Matrix loaded successfully")
                except Exception as e:
                    print(f"Error loading matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error loading matrix: {str(e)}", "matrix": default_matrix})
                
                # Check if we have a valid matrix
                if not dictMatrix:
                    print("Matrix is empty")
                    return json.dumps({"message":"error", "error": "Matrix is empty", "matrix": default_matrix})
                
                # Fill the matrix
                try:
                    for i in range(0,len(receivedIds)):
                        for j in range(0,len(receivedIds)):
                            id_i = receivedIds[i]
                            id_j = receivedIds[j]
                            
                            if id_i not in dictGlobalIDAuthorName:
                                print(f"ID {id_i} not found in dictionary")
                                X[i][j] = 0
                                continue
                                
                            if id_j not in dictGlobalIDAuthorName:
                                print(f"ID {id_j} not found in dictionary")
                                X[i][j] = 0
                                continue
                            
                            data_id_i = dictGlobalIDAuthorName[id_i]['dataID']
                            data_id_j = dictGlobalIDAuthorName[id_j]['dataID']
                            
                            if data_id_i not in dictMatrix:
                                print(f"Data ID {data_id_i} not found in matrix")
                                X[i][j] = 0
                                continue
                                
                            if data_id_j not in dictMatrix[data_id_i]:
                                print(f"Data ID {data_id_j} not found in matrix[{data_id_i}]")
                                X[i][j] = 0
                                continue
                            
                            X[i][j] = dictMatrix[data_id_i][data_id_j]
                except Exception as e:
                    print(f"Error filling matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error filling matrix: {str(e)}", "matrix": default_matrix})
                
                print("Matrix filled successfully")
                
            elif matrixType == 'cocitation':
                # Similar implementation as coauthor with appropriate error handling
                matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-citation_authors_dictionary_matrix.p"))
                print(f"Loading co-citation matrix from: {matrix_file_path}")
                
                if not os.path.exists(matrix_file_path):
                    print(f"Matrix file not found: {matrix_file_path}")
                    return json.dumps({"message":"error", "error": "Matrix file not found", "matrix": default_matrix})
                
                try:
                    dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                    print(f"Matrix loaded successfully")
                except Exception as e:
                    print(f"Error loading matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error loading matrix: {str(e)}", "matrix": default_matrix})
                
                if not dictMatrix:
                    print("Matrix is empty")
                    return json.dumps({"message":"error", "error": "Matrix is empty", "matrix": default_matrix})
                
                try:
                    for i in range(0,len(receivedIds)):
                        for j in range(0,len(receivedIds)):
                            id_i = receivedIds[i]
                            id_j = receivedIds[j]
                            
                            if id_i not in dictGlobalIDAuthorName or id_j not in dictGlobalIDAuthorName:
                                X[i][j] = 0
                                continue
                            
                            data_id_i = dictGlobalIDAuthorName[id_i]['dataID']
                            data_id_j = dictGlobalIDAuthorName[id_j]['dataID']
                            
                            if data_id_i not in dictMatrix or data_id_j not in dictMatrix[data_id_i]:
                                X[i][j] = 0
                                continue
                            
                            X[i][j] = dictMatrix[data_id_i][data_id_j]
                except Exception as e:
                    print(f"Error filling matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error filling matrix: {str(e)}", "matrix": default_matrix})
                
            elif matrixType == 'authortopic':
                # Similar implementation as coauthor with appropriate error handling
                matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "author_topic_dictionary_matrix.p"))
                print(f"Loading author-topic matrix from: {matrix_file_path}")
                
                if not os.path.exists(matrix_file_path):
                    print(f"Matrix file not found: {matrix_file_path}")
                    return json.dumps({"message":"error", "error": "Matrix file not found", "matrix": default_matrix})
                
                try:
                    dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                    print(f"Matrix loaded successfully")
                except Exception as e:
                    print(f"Error loading matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error loading matrix: {str(e)}", "matrix": default_matrix})
                
                if not dictMatrix:
                    print("Matrix is empty")
                    return json.dumps({"message":"error", "error": "Matrix is empty", "matrix": default_matrix})
                
                try:
                    for i in range(0,len(receivedIds)):
                        for j in range(0,len(receivedIds)):
                            id_i = receivedIds[i]
                            id_j = receivedIds[j]
                            
                            if id_i not in dictGlobalIDAuthorName or id_j not in dictGlobalIDAuthorName:
                                X[i][j] = 0
                                continue
                            
                            data_id_i = dictGlobalIDAuthorName[id_i]['dataID']
                            data_id_j = dictGlobalIDAuthorName[id_j]['dataID']
                            
                            if data_id_i not in dictMatrix or data_id_j not in dictMatrix[data_id_i]:
                                X[i][j] = 0
                                continue
                            
                            X[i][j] = dictMatrix[data_id_i][data_id_j]
                except Exception as e:
                    print(f"Error filling matrix: {str(e)}")
                    return json.dumps({"message":"error", "error": f"Error filling matrix: {str(e)}", "matrix": default_matrix})
            
            # Convert to numpy array and prepare return matrix
            X = np.asarray(X)
            returnMatrix = [[X[i][j] for j in range(length)] for i in range(length)]

            a = {"message":"success", "matrix": returnMatrix}
            a = convert_numpy_types(a)
            return json.dumps(a)
            
        except Exception as e:
            print(f"Error processing similarity data: {str(e)}")
            return json.dumps({"message":"error", "error": f"Error processing similarity data: {str(e)}", "matrix": default_matrix})
            
    except Exception as e:
        print(f"Error in similarity route: {str(e)}")
        # Return an empty matrix of the requested size as fallback
        default_matrix = [[0 for _ in range(length)] for _ in range(length)]
        return json.dumps({"message":"error", "error": f"Error in similarity route: {str(e)}", "matrix": default_matrix})

port = os.getenv('VCAP_APP_PORT', '5000')
		
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(port), debug=True)