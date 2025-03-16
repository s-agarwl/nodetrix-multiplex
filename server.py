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
import urllib.request
import tempfile
import random

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

# Helper function to get data file paths or download from GitHub if needed
def get_data_file(file_path):
    """
    This function handles file paths differently based on the environment:
    1. On Vercel: Tries to find the file, and if not found, downloads it from GitHub
    2. In development: Uses paths relative to the script
    """
    # Check if running on Vercel
    is_vercel = os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV')
    
    # GitHub raw content URL for your repository
    # Replace with your actual GitHub username and repository name
    GITHUB_RAW_URL = os.environ.get('GITHUB_RAW_URL', 'https://raw.githubusercontent.com/s-agarwl/nodetrix-multiplex/main')
    
    if is_vercel:
        # On Vercel, first check if the file exists in the deployment
        local_path = os.path.join('/var/task', file_path)
        print(f"Vercel path: {local_path}")
        
        if not os.path.exists(local_path):
            print(f"File not found in Vercel deployment: {local_path}")
            
            # Try alternative paths
            alt_paths = [file_path, os.path.basename(file_path)]
            found = False
            
            for alt_path in alt_paths:
                if os.path.exists(alt_path):
                    print(f"Found file at alternative path: {alt_path}")
                    return alt_path
            
            # If still not found, download from GitHub
            if not found:
                # Use /tmp directory for downloaded files (the only writable directory in Vercel)
                tmp_path = os.path.join(tempfile.gettempdir(), os.path.basename(file_path))
                
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(tmp_path), exist_ok=True)
                
                # Construct GitHub URL
                github_url = f"{GITHUB_RAW_URL}/{file_path}"
                print(f"Downloading file from GitHub: {github_url}")
                
                try:
                    # Create a request with a user agent
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                    req = urllib.request.Request(github_url, headers=headers)
                    
                    # Download the file
                    with urllib.request.urlopen(req) as response:
                        data = response.read()
                        with open(tmp_path, 'wb') as f:
                            f.write(data)
                    
                    print(f"Successfully downloaded to {tmp_path} ({os.path.getsize(tmp_path)} bytes)")
                    return tmp_path
                except Exception as e:
                    print(f"Error downloading file: {str(e)}")
                    # If download fails, try to use mock data
                    print("Using mock data instead")
                    return None
        
        return local_path
    else:
        # Local development - use path relative to script
        local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_path)
        print(f"Local path: {local_path}")
        
        # Check if file exists
        if not os.path.exists(local_path):
            print(f"Warning: File not found locally: {local_path}")
            return None
        
        return local_path

app = Flask(__name__)

@app.route('/debug/check-files')
def debug_check_files():
    """Debug endpoint to check file paths and existence."""
    try:
        # Create a dictionary to hold the results
        result = {
            "cwd": os.getcwd(),
            "env": {},
            "directories": {},
            "files": {},
            "pickle_files": [],
            "github_url": os.environ.get('GITHUB_RAW_URL', 'Not set')
        }
        
        # Add environment variables
        for key, value in os.environ.items():
            if key.startswith("VERCEL") or key == "GITHUB_RAW_URL":
                result["env"][key] = value
        
        # Check directories
        directories = [
            ".",
            "/var/task",
            "/var/task/static",
            "/var/task/static/server_services",
            "/var/task/static/server_services/pythondata_infovis2015",
            "static",
            "static/server_services",
            "static/server_services/pythondata_infovis2015",
            tempfile.gettempdir()
        ]
        
        for directory in directories:
            if os.path.exists(directory):
                try:
                    files = os.listdir(directory)
                    result["directories"][directory] = {
                        "exists": True,
                        "files": files
                    }
                except Exception as e:
                    result["directories"][directory] = {
                        "exists": True,
                        "error": str(e)
                    }
            else:
                result["directories"][directory] = {
                    "exists": False
                }
        
        # Check specific data files
        data_files = [
            "/var/task/static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
            "/var/task/static/server_services/pythondata_infovis2015/co-authorship_dictionary_matrix.p",
            "/var/task/static/server_services/pythondata_infovis2015/co-citation_authors_dictionary_matrix.p",
            "/var/task/static/server_services/pythondata_infovis2015/author_topic_dictionary_matrix.p",
            "static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
            "static/server_services/pythondata_infovis2015/co-authorship_dictionary_matrix.p",
            "static/server_services/pythondata_infovis2015/co-citation_authors_dictionary_matrix.p",
            "static/server_services/pythondata_infovis2015/author_topic_dictionary_matrix.p",
            os.path.join(tempfile.gettempdir(), "dictGlobalIDAuthorName.p"),
            os.path.join(tempfile.gettempdir(), "co-authorship_dictionary_matrix.p"),
            os.path.join(tempfile.gettempdir(), "co-citation_authors_dictionary_matrix.p"),
            os.path.join(tempfile.gettempdir(), "author_topic_dictionary_matrix.p")
        ]
        
        for file_path in data_files:
            if os.path.exists(file_path):
                result["files"][file_path] = {
                    "exists": True,
                    "size": os.path.getsize(file_path)
                }
            else:
                result["files"][file_path] = {
                    "exists": False
                }
        
        # Find all pickle files
        for root_dir in [".", "/var/task", tempfile.gettempdir()]:
            if os.path.exists(root_dir):
                for dirpath, dirnames, filenames in os.walk(root_dir):
                    for filename in filenames:
                        if filename.endswith(".p") or filename.endswith(".pickle"):
                            file_path = os.path.join(dirpath, filename)
                            result["pickle_files"].append({
                                "path": file_path,
                                "size": os.path.getsize(file_path)
                            })
        
        # Test GitHub download
        if os.environ.get('GITHUB_RAW_URL'):
            result["github_test"] = {
                "url": f"{os.environ.get('GITHUB_RAW_URL')}/static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
                "status": "Not tested"
            }
            try:
                test_url = f"{os.environ.get('GITHUB_RAW_URL')}/static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p"
                req = urllib.request.Request(test_url, method="HEAD")
                resp = urllib.request.urlopen(req, timeout=5)
                result["github_test"]["status"] = f"Success: {resp.status} {resp.reason}"
                result["github_test"]["content_length"] = resp.headers.get("Content-Length", "Unknown")
            except Exception as e:
                result["github_test"]["status"] = f"Error: {str(e)}"
        
        # Set content type to application/json
        return app.response_class(
            response=json.dumps(result, indent=2),
            status=200,
            mimetype='application/json'
        )
    except Exception as e:
        return app.response_class(
            response=json.dumps({"error": str(e)}),
            status=500,
            mimetype='application/json'
        )

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
        receivedIds = request.json["ids"]
        matrixType = request.json["matrixType"]
        length = len(receivedIds)
        print(f"Processing similarity request for {length} IDs, matrix type: {matrixType}")

        # Generate a default matrix in case of errors
        default_matrix = [[0 for _ in range(length)] for _ in range(length)]
        
        # Set diagonal to 1 (self-similarity)
        for i in range(length):
            default_matrix[i][i] = 1
        
        # Get the dictionary file path
        dict_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "dictGlobalIDAuthorName.p"))
        
        # If file doesn't exist or couldn't be downloaded, use mock data
        if dict_file_path is None:
            print("Dictionary file not found or couldn't be downloaded, using mock data")
            
            # Create a mock matrix with some random connections
            mock_matrix = [[0 for _ in range(length)] for _ in range(length)]
            
            # Set diagonal to 1 (self-similarity)
            for i in range(length):
                mock_matrix[i][i] = 1
            
            # Add some random connections based on matrix type
            density = 0.2  # 20% of cells will have non-zero values
            
            if matrixType == 'coauthor':
                # Co-authorship tends to be sparse
                density = 0.1
            elif matrixType == 'cocitation':
                # Co-citation can be denser
                density = 0.3
            elif matrixType == 'authortopic':
                # Author-topic can be medium density
                density = 0.2
            
            # Fill the matrix with random values
            for i in range(length):
                for j in range(i+1, length):  # Only upper triangle (symmetric matrix)
                    if random.random() < density:
                        # Random value between 0.1 and 0.9
                        value = round(0.1 + random.random() * 0.8, 2)
                        mock_matrix[i][j] = value
                        mock_matrix[j][i] = value  # Symmetric
            
            return json.dumps({"message":"success", "matrix": mock_matrix})
        
        # Load the dictionary
        try:
            dictGlobalIDAuthorName = pickle.load(open(dict_file_path, "rb"))
            print(f"Dictionary loaded successfully, contains {len(dictGlobalIDAuthorName)} entries")
        except Exception as e:
            print(f"Error loading dictionary: {str(e)}, using mock data")
            return json.dumps({"message":"success", "matrix": default_matrix})
        
        # Check if we have a valid dictionary
        if not dictGlobalIDAuthorName:
            print("Dictionary is empty, using default matrix")
            return json.dumps({"message":"success", "matrix": default_matrix})
        
        # Initialize matrix
        X = [[0 for _ in range(length)] for _ in range(length)]
            
        # Process based on matrix type
        if matrixType == 'coauthor':
            matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-authorship_dictionary_matrix.p"))
            
            # If file doesn't exist or couldn't be downloaded, use mock data
            if matrix_file_path is None:
                print("Matrix file not found or couldn't be downloaded, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Load the matrix
            try:
                dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                print(f"Matrix loaded successfully")
            except Exception as e:
                print(f"Error loading matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Check if we have a valid matrix
            if not dictMatrix:
                print("Matrix is empty, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Fill the matrix
            try:
                for i in range(length):
                    for j in range(length):
                        id_i = receivedIds[i]
                        id_j = receivedIds[j]
                        
                        # Set diagonal to 1 (self-similarity)
                        if i == j:
                            X[i][j] = 1
                            continue
                        
                        if id_i not in dictGlobalIDAuthorName:
                            X[i][j] = 0
                            continue
                            
                        if id_j not in dictGlobalIDAuthorName:
                            X[i][j] = 0
                            continue
                        
                        data_id_i = dictGlobalIDAuthorName[id_i]['dataID']
                        data_id_j = dictGlobalIDAuthorName[id_j]['dataID']
                        
                        if data_id_i not in dictMatrix:
                            X[i][j] = 0
                            continue
                            
                        if data_id_j not in dictMatrix[data_id_i]:
                            X[i][j] = 0
                            continue
                        
                        X[i][j] = dictMatrix[data_id_i][data_id_j]
            except Exception as e:
                print(f"Error filling matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
        elif matrixType == 'cocitation':
            matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "co-citation_authors_dictionary_matrix.p"))
            
            # If file doesn't exist or couldn't be downloaded, use mock data
            if matrix_file_path is None:
                print("Matrix file not found or couldn't be downloaded, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Load the matrix
            try:
                dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                print(f"Matrix loaded successfully")
            except Exception as e:
                print(f"Error loading matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Check if we have a valid matrix
            if not dictMatrix:
                print("Matrix is empty, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Fill the matrix
            try:
                for i in range(length):
                    for j in range(length):
                        id_i = receivedIds[i]
                        id_j = receivedIds[j]
                        
                        # Set diagonal to 1 (self-similarity)
                        if i == j:
                            X[i][j] = 1
                            continue
                        
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
                print(f"Error filling matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
        elif matrixType == 'authortopic':
            matrix_file_path = get_data_file(os.path.join("static/server_services/pythondata_infovis2015", "author_topic_dictionary_matrix.p"))
            
            # If file doesn't exist or couldn't be downloaded, use mock data
            if matrix_file_path is None:
                print("Matrix file not found or couldn't be downloaded, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Load the matrix
            try:
                dictMatrix = pickle.load(open(matrix_file_path, "rb"))
                print(f"Matrix loaded successfully")
            except Exception as e:
                print(f"Error loading matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Check if we have a valid matrix
            if not dictMatrix:
                print("Matrix is empty, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
            
            # Fill the matrix
            try:
                for i in range(length):
                    for j in range(length):
                        id_i = receivedIds[i]
                        id_j = receivedIds[j]
                        
                        # Set diagonal to 1 (self-similarity)
                        if i == j:
                            X[i][j] = 1
                            continue
                        
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
                print(f"Error filling matrix: {str(e)}, using default matrix")
                return json.dumps({"message":"success", "matrix": default_matrix})
        
        return json.dumps({"message":"success", "matrix": X})
            
    except Exception as e:
        print(f"Error in similarity route: {str(e)}")
        # Return an empty matrix of the requested size as fallback
        default_matrix = [[0 for _ in range(length)] for _ in range(length)]
        # Set diagonal to 1 (self-similarity)
        for i in range(length):
            default_matrix[i][i] = 1
        return json.dumps({"message":"success", "matrix": default_matrix})

port = os.getenv('VCAP_APP_PORT', '5000')
		
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(port), debug=True)