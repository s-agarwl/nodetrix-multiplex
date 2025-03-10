
# NOT WORKING ANYMORE SHIFTED TO SERVER.PY

import predict
import os.path
from flask import Flask, request, json
from flask import render_template
from flask.ext.cors import CORS, cross_origin
from sklearn.cluster import KMeans
import numpy as np
import scipy as sp
import skfuzzy as fuzz
import pickle
from sklearn import metrics
from sklearn import preprocessing
import math
import matplotlib.pyplot as plt
import networkx as nx
import community
# import kmedoid
# from kmeans import k_means
import sys
from time import time
import copy

app = Flask(__name__)

@app.route('/')
def clusterings():
    return render_template('index.html')

@app.route('/cluster', methods=['GET','POST'])
@cross_origin()
def fooBeforeCluster():
	receivedMatrix = request.json["matrix"]
	WeightMatrix = request.json["weightMatrix"]
	normalizedMatrix = request.json["normalizedWeightMatrix"]
	clusteringType = request.json["clustering"]
	numberOfClusters = request.json["numberOfClusters"]
	labels = request.json["labels"]
	open("clusterstats.txt", 'w').close()
	f = open("clusterstats_condensed.txt", 'w')
	tempString2 = "Clustering type, Number_of_clusters, Qg, Silhouette Coefficient(kmeans), FPC(cmeans), Modularity(Louvain)"
	f.write(tempString2 +'\n')
	f.close()

	length = len(receivedMatrix)
	d = int(math.ceil(length/3.0))
	print ("d = ",d, "length = " ,length, "compte: ",math.ceil(length/3.0)," #clusters: " ,numberOfClusters)
	if clusteringType == "louvain":
			RM , CV, NC = foo(receivedMatrix, WeightMatrix, normalizedMatrix, clusteringType, 2, labels, numberOfClusters)
	else:
		for i in range(2,d+1):

			rm , cv, nc = foo(receivedMatrix, WeightMatrix, normalizedMatrix, clusteringType, i, labels, numberOfClusters)
			
			if i == numberOfClusters:
				RM = copy.deepcopy(rm)
				CV = copy.deepcopy(cv)
				NC = nc
		

	# print RM
	a = {"message":"success", "matrix": RM, "clusterVector": CV, "numberofClusters": NC}
	return json.dumps(a)

def column(matrix, i):
    return [row[i] for row in matrix]

def foo(receivedMatrix, WeightMatrix, normalizedMatrix, clusteringType, numberOfClusters, labels, originalNumberOfClusters):

	# receivedMatrix = request.json["matrix"]
	# WeightMatrix = request.json["weightMatrix"]
	# normalizedMatrix = request.json["normalizedWeightMatrix"]
	# clusteringType = request.json["clustering"]
	# numberOfClusters = request.json["numberOfClusters"]
	# labels = request.json["labels"]
	# print labels
	# print labels[0]["name"]
	# fooClustersWrite(receivedMatrix, WeightMatrix, normalizedMatrix, clusteringType, numberOfClusters)

	# print ("normalized matrix:",normalizedMatrix)
	# print ("weight matrix: ", WeightMatrix)
	length = len(normalizedMatrix)
	
	X = [None] * length
	W = [None] * length
	Wnorm = [0] * length
	normalizedReceivedMatrix = [0] * length

	if clusteringType == "louvain":
		numberOfClusters = 6


	degreeList = [0] * length
	# degreeMatrix = [0] * length
	for x in range(0,length):
		X[x] = [None] * length
		W[x] = [None] * length
		Wnorm[x] = [0] * length
		normalizedReceivedMatrix[x] = [0] * length
		# degreeMatrix[x] = [0] * length
		tempDegree = 0
		# print type(X),X
		for y in range(0,length):
			# print type(str(x)), type(x)
			X[x][y] = float(receivedMatrix[str(x)][str(y)])
			W[x][y] = float(WeightMatrix[str(x)][str(y)])
			normalizedReceivedMatrix[x][y] = float(normalizedMatrix[str(x)][str(y)])
			tempDegree = tempDegree + W[x][y]
		# degreeMatrix[x][x] = tempDegree
		degreeList[x] = tempDegree

	# print X
	# print (type(X))


	X = np.asarray(X, dtype=np.float64)
	W = np.asarray(W, dtype=np.float64)
	Wnorm = np.asarray(Wnorm, dtype=np.float64)

	maximum = W.max()
	minimum = W.min()
	# print("maximum, minimium: ", maximum," , ",  minimum)

	# Normalization
	
	for i in range(0, length):
		for j in range(0, length):
			# if maximum == minimum:
				# if minimum > 0:
			# 		Wnorm[i][j] = 1
			# 	elif minimum == 0:
			# 		Wnorm[i][j] = 0
			# else :
				# Wnorm[i][j] = float((W[i][j] - minimum)/(maximum - minimum))
				Wnorm[i][j] = W[i][j]
				# print(type(Wnorm[i][j]))
	

	# print("unnormalized weight: ", W)
	# print("Normalized Weight similarity: ", Wnorm)

	# Converting to similarity
	for i in range(0, length):
		for j in range(0, length):
			# Wnorm[i][j] = 1 - Wnorm[i][j]
			normalizedReceivedMatrix[i][j] = 1 - normalizedReceivedMatrix[i][j]

			# if i ==j:
			# 	normalizedReceivedMatrix[i][j] = 0.0


	normalizedReceivedMatrix = np.asarray(normalizedReceivedMatrix, dtype=np.float64)

	for r in range(1,2):
		if r ==1:
			Wnorm = normalizedReceivedMatrix

		# print("Current Matrix: ", Wnorm)

		degreeMatrix = [0] * length
		for x in range(0,length):
			degreeMatrix[x] = [0] * length
			tempDegree = 0
			for y in range(0,length):
				tempDegree = tempDegree + Wnorm[x][y]
			degreeMatrix[x][x] = tempDegree
			degreeList[x] = tempDegree
		


		degreeMatrix = np.asarray(degreeMatrix, dtype=np.float64)
		dInverse = np.linalg.inv(degreeMatrix)
		dInverseSquareRoot = sp.linalg.sqrtm(dInverse)

		laplacian = np.subtract(degreeMatrix, Wnorm)

		normalizedLaplacian = np.dot(dInverseSquareRoot, np.dot(laplacian,dInverseSquareRoot) )
		identity = np.identity(len(normalizedLaplacian))
		Lsym = np.subtract(identity, normalizedLaplacian)
		eigenValues,eigenVectors = np.linalg.eig(Lsym)

		# print ("eigen values", eigenValues)
		# print("now eigen vectors")
		# print(eigenVectors)

		sortedEigenValue = [None] * len(eigenValues)
		for i in range(0, len(eigenValues)):
			sortedEigenValue[i] = eigenValues[i]

		if length != len(eigenValues):
			print "Size of eigen values and matrix mimatch"
		else:
			length = len(eigenValues)

		n = length
		indicesList =np.array(sortedEigenValue).argsort()[::-1][:n]

		# print ("Sorted eigen values", eigenValues[indicesList])

		# print(type(eigenVectors))

		U = eigenVectors[:,indicesList]
		# print("U = ", U)
		# print("numberOfClusters = ", numberOfClusters)
		collist=[]
		for i in range(0, numberOfClusters):
			collist.append(i)
		# print ("Column list = ", collist)
		

		if r ==1 and numberOfClusters == originalNumberOfClusters:
			clusterAnalytics(U, clusteringType)

		U = U[:,collist]
		# print("U only k columns = ", U)

		# Unorm = preprocessing.normalize(U, norm='l1')

		# L2 norm:
		length = len(W)
		for i in range(0, length):
			rowsqsum = 0
			for j in range(0,numberOfClusters):
				rowsqsum += U[i][j] * U[i][j]
			sqrootsum = math.sqrt(rowsqsum)
			if sqrootsum !=0:
				for j in range(0, numberOfClusters):
					U[i][j] = U[i][j]/sqrootsum
		Unorm = U
		# print("U normalized: ", Unorm)

		# row wise
		
		# -------------------------------------------------------
		# NOTE: normalized Unorm has to be checked for validity
		# -------------------------------------------------------

		# print "Received MAtrix: ", Unorm
		returnClusterVector = [None] * length
		returnMatrix = [None] * numberOfClusters
		for i in range(0, numberOfClusters):
			returnMatrix[i] = [None] * length

		# Silcoef = -999
		statfile2_silhouette = "-"
		statfile2_fpc = "-"
		statfile2_modularity = "-"
		if (clusteringType == "kmeans"):
			km = KMeans(n_clusters=numberOfClusters, init='k-means++', max_iter=100, n_init=1)
			cluster_labels = km.fit(Unorm)
			# print cluster_labels, km.labels_
			Silcoef = metrics.silhouette_score(Unorm, km.labels_)
			score = "Silhoette Score: " + str(Silcoef)
			statfile2_silhouette = str(Silcoef)
			# returnMatrix = [0] * numberOfClusters
			for i in range(0, numberOfClusters):
				# returnMatrix[i] = [0] * length
				for j in range(0,len(km.labels_)):
					if(km.labels_[j] == i):
						returnMatrix[i][j] = 1;
					else:
						returnMatrix[i][j] = 0;

			# print(km.labels_)
			# print(returnMatrix)
			# print ("km-labels_ : ",km.labels_)
			for i in range(0, len(km.labels_)):
				returnClusterVector[i] = np.asscalar(km.labels_[i])
			print ("return cluster vector: ", returnClusterVector)

		elif (clusteringType == "fcm"):

			Unormtranspose_features_cross_samples = np.matrix.transpose(Unorm)
					
			cntr, u, u0, d, jm, p, fpc  = fuzz.cluster.cmeans(Unormtranspose_features_cross_samples, numberOfClusters, 2, error = 0.005, maxiter = 1000)

			for i in range(0, numberOfClusters):
				for j in range(0,length):
					returnMatrix[i][j] = u[i][j]

			lengthofMatrix = len(returnMatrix[0])
			for t in range(0, lengthofMatrix):
				R = column(returnMatrix, t)
				tmax = max(R)
				c = R.index(tmax)
				returnClusterVector[t] = c
				print ("R = ", R, "tmax = ", tmax, "c = ", c, "t = ", t)

			print "return cluster vec: ",returnClusterVector


			# print ("centre", cntr)
			# print("u", u)
			# print("fpc", fpc)
			# print("d", d)
			score = "Fuzzy Partition Coefficient: " + str(fpc)
			statfile2_fpc = str(fpc)
		
		elif (clusteringType == "louvain"):
			
			G = nx.Graph(normalizedReceivedMatrix)
			# Adj1 = nx.adjacency_matrix(G)
			# print Adj1.todense()
			partition = community.best_partition(G)
			
			#drawing
			# size = float(len(set(partition.values())))
			# pos = nx.spring_layout(G)
			# count = 0.
			# for com in set(partition.values()) :
			#     count = count + 1.
			#     list_nodes = [nodes for nodes in partition.keys()
			#                                 if partition[nodes] == com]
			#     nx.draw_networkx_nodes(G, pos, list_nodes, node_size = 20,
			#                                 node_color = str(count / size))


			# nx.draw_networkx_edges(G,pos, alpha=0.5)
			# plt.show()
			numberofcomm = len(set(partition.values()))
			numberOfClusters = numberofcomm

			print ("Number of community: ", numberofcomm)
			returnMatrix = [0] * numberofcomm
			for i in range(0, numberofcomm):
				returnMatrix[i] = [0]*length
			
			for j in range(0,length):
					returnMatrix[partition[j]][j] = 1
			# print "REturn matrix: ",returnMatrix
			returnClusterVector = partition.values()

			statfile2_modularity = str(community.modularity(partition, G))
			score = "Modularity: " + str(statfile2_modularity)
			# a = {"message":"success", "matrix": returnMatrix, "clusterVector": returnClusterVector, "numberofClusters": numberofcomm}
			# return json.dumps(a)

		MembershipMatrix = np.asarray(returnMatrix)
		m = np.asarray(degreeList, dtype=np.float64)
		A_ = ((np.outer(m, m))/(np.linalg.norm(Wnorm) * np.linalg.norm(Wnorm)))
		A = (np.outer(m, m))/(np.linalg.norm(Wnorm))
		B_ = np.subtract(Wnorm , A_)
		B  = np.subtract(Wnorm ,A)
		Q = np.trace( np.dot(np.dot(MembershipMatrix, B), np.matrix.transpose(MembershipMatrix) )) / np.linalg.norm(Wnorm)
		Qcorrected = np.trace( np.dot(np.dot(MembershipMatrix, B_), np.matrix.transpose(MembershipMatrix) )) / np.linalg.norm(Wnorm)

		# print("Membership matrix = ", MembershipMatrix,"m = ",m, " B = ", B, "W = ", W, "A = ", A, "W norm = ", np.linalg.norm(Wnorm))
		# print(W)
		# print ("Qg : ", Q, "Qg (corrected) : ", Qcorrected)

		statfile = open("clusterstats.txt", 'a')
		statfile2 = open("clusterstats_condensed.txt",'a')

		# tempString2 = "Clustering type, Number_of_clusters, Qg, Silhouette Coefficient, FPC"
		# statfile2.write(tempString2 +'\n')

		tempString = "\n-----------------------------------------------\nClustering type: "+ clusteringType +" \nNumber of clusters = " + str(numberOfClusters) + ":\n"
		
		if r ==0:
			tempString += "\n Unnormalized Matrix\n"
		else:
			tempString += "\n Normalized Matrix\n"
		for clusterNum in range(0, numberOfClusters):
			nodeList=[]
			nodeNames = []
			temp={}
			for i in range(0,len(returnClusterVector)):
				if returnClusterVector[i] == clusterNum:
					nodeList.append(i)
					R = column(returnMatrix, i)
					tmax = max(R)
					tmax = "{0:.4f}".format(tmax)
					nodeNames.append((str(labels[i]["name"]), tmax))
			# tempString += "Nodelist : "+ str(nodeList)
			
			if (clusteringType == "kmeans" or clusteringType == "louvain" or clusteringType == "fcm"):
				l_s = 0
				for j in range(0, len(nodeList)):
					for k in range(0, length):
						if Wnorm[nodeList[j]][k] >0 and k in nodeList:
							if r ==0:
								l_s = l_s + 1
							elif r==1:
								if nodeList[j]!=k:
									l_s = l_s + 1
				tempString += "\n\t" +"Cluster id: "+ str(clusterNum )+ " \t Links in cluster(l_s): = " +str(l_s/2) + "\t Nodes: " + str(len(nodeList)) +"\t Nodelist: "+str(nodeList) + "\n\t Names: " + str(nodeNames)
				# print(tempString)	
				statfile.write(tempString + '\n')
				tempString=''

		L = 0
		for i in range(0, length):
			for j in range(0, length):
				if Wnorm[i][j] >0:
					if r ==0:
						L = L+1
					elif r==1:
						if i!=j:
							L = L +1

		

		tempString +="\tTotal number of nodes in matrix: " + str(len(Wnorm)) + "\tTotal number of links in matrix (L):  " +  str(L/2)
		tempString += "\n\t Qg : "+str(Q) + "\t Qg (corrected) : "+ str(Qcorrected) + "\t \t" +score

		statfile2.write(clusteringType + ", " + str(numberOfClusters) + "," + str(Q) + "," + statfile2_silhouette + "," + statfile2_fpc + ","+statfile2_modularity+"\n" )
		
		statfile.write(tempString)
		# print tempString
		statfile.close()
		statfile2.close()

	# a = {"message":"success", "matrix": returnMatrix, "clusterVector": returnClusterVector, "numberofClusters": numberOfClusters}
	# return json.dumps(a)
	return returnMatrix, returnClusterVector, numberOfClusters


def clusterAnalytics(U, clusteringType):


	length = len(U)
	length2 = len(U[0])
	datax = []
	datay = []
	# for i in range(0, length):
	# 	rowsqsum = 0
	# 	for j in range(0,length2):
	# 		rowsqsum += U[i][j] * U[i][j]
	# 	sqrootsum = math.sqrt(rowsqsum)
	# 	if sqrootsum !=0:
	# 		for j in range(0, length2):
	# 			U[i][j] = U[i][j]/sqrootsum


	if (clusteringType == "kmeans"):
		colList = []
		for i in range(2,length):
			for z in range(0,i):
				colList.append(z)
			Unorm = U[:, colList]

			km = KMeans(n_clusters=i, init='k-means++', max_iter=100, n_init=1)
			
			# print ("Unorm at :",i, " iteration is: ",Unorm)
			cluster_labels = km.fit(Unorm)
			Silcoef = metrics.silhouette_score(Unorm, km.labels_)
			datax.append(i)
			datay.append(Silcoef)

		plt.plot(datax, datay)
		plt.ylabel('Silhouette coefficient')
		plt.xlabel('number of clusters')
		plt.grid(True)
		plt.show()
	elif (clusteringType == "fcm"):
		colList = []
		for i in range(2,length):
			for z in range(0,i):
				colList.append(z)
			Unorm = U[:, colList]
			Unormtranspose_features_cross_samples = np.matrix.transpose(Unorm)
			cntr, u, u0, d, jm, p, fpc  = fuzz.cluster.cmeans(Unormtranspose_features_cross_samples, i, 2, error = 0.005, maxiter = 1000)
			datax.append(i)
			datay.append(fpc)
		plt.plot(datax, datay)
		plt.ylabel('Fuzzy partition coefficient')
		plt.xlabel('number of clusters')
		plt.grid(True)
		plt.show()
	return

@app.route('/applyLaplacian', methods=['GET','POST'])
@cross_origin()
def applyLaplacian():

	receivedMatrix = request.json["matrix"]
	# clusteringType = request.json["clustering"]
	# numberOfClusters = request.json["numberOfClusters"]
	
	# print len(receivedMatrix)
	# print len(receivedMatrix["0"])
	# print type(receivedMatrix)
	# print receivedMatrix
	# print receivedMatrix["0"]["0"]
	length = len(receivedMatrix)

	X = [None] * length
	degreeMatrix = [0] * length
	for x in range(0,length):
		X[x] = [None] * length
		degreeMatrix[x] = [0] * length
		tempDegree = 0
		# print type(X),X
		for y in range(0,length):
			# print type(str(x)), type(x)
			X[x][y] = receivedMatrix[str(x)][str(y)]
			tempDegree = tempDegree + X[x][y]
		degreeMatrix[x][x] = tempDegree

	
	# print (type(X))
	X = np.asarray(X)
	degreeMatrix = np.asarray(degreeMatrix)
	dInverse = np.linalg.inv(degreeMatrix)
	dInverseSquareRoot = sp.linalg.sqrtm(dInverse)

	laplacian = np.subtract(degreeMatrix, X)

	# normalizedLaplacian = np.dot(dInverseSquareRoot, np.dot(laplacian,dInverseSquareRoot) )
	normalizedLaplacian = laplacian
	print normalizedLaplacian

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length

	for i in range(0, length):
		for j in range(0,length):
			returnMatrix[i][j] = normalizedLaplacian[i][j]

	a = {"message":"success", "matrix": returnMatrix}
	return json.dumps(a)


@app.route('/power2', methods=['GET','POST'])
@cross_origin()
def power():

	receivedMatrix = request.json["matrix"]
	
	
	length = len(receivedMatrix)

	X = [None] * length
	# degreeMatrix = [0] * length
	for x in range(0,length):
		X[x] = [None] * length
		for y in range(0,length):
			X[x][y] = receivedMatrix[str(x)][str(y)]


	
	# print (type(X))
	X = np.asarray(X)
	Xpower2 = np.linalg.matrix_power(X,2)

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length
		for j in range(0,length):
			returnMatrix[i][j] = Xpower2[i][j] + X[i][j];



	print ("received:", receivedMatrix)
	print("ReturnMatrix", returnMatrix)

	a = {"message":"success", "matrix": returnMatrix}
	return json.dumps(a)


@app.route('/similarity', methods=['GET','POST'])
@cross_origin()
def similarity():

	# DATA_DIR = "/media/shivam/Shivam Data/Amit/augmentednodetrix/src/server_services/pythondata_cora"
	# DATA_DIR = "/media/shivam/Shivam Data/Amit/augmentednodetrix/src/server_services/pythondata"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_cora"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata"
	DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_infovis2015"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_usf"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_wordnet"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_adjnoun"
	print "in similarity"
	receivedIds = request.json["ids"]
	matrixType = request.json["matrixType"]
	length = len(receivedIds)
	print receivedIds

	X = [None] * length
	for x in range(0,length):
		X[x] = [None] * length	

	


	# dictGlobalIDAuthorName = pickle.load(open("./pythondata/authors_with_id_and_name.p","rb"))
	dictGlobalIDAuthorName = pickle.load(open(DATA_DIR+"/dictGlobalIDAuthorName.p","rb"))
	# print dictGlobalIDAuthorName


	if matrixType == 'coauthor':
		dictMatrix = pickle.load(open(DATA_DIR + "/co-authorship_dictionary_matrix.p","rb"))
		# print dictMatrix
		print "in co-author"

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print X
		print matrixType
	elif matrixType == 'cocitation':
		dictMatrix = pickle.load(open(DATA_DIR + "/co-citation_authors_dictionary_matrix.p","rb"))
		# print dictMatrix
		print "in cocitation"

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print X
		print matrixType
	elif matrixType == 'authortopic':
		print "in authortopic"
		dictMatrix = pickle.load(open(DATA_DIR + "/author_topic_dictionary_matrix.p","rb"))
		print dictMatrix
		print "received ids: ",receivedIds
		print "global author name: ",dictGlobalIDAuthorName

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print X
		print matrixType


	# clusteringType = request.json["clustering"]
	# numberOfClusters = request.json["numberOfClusters"]
	
	# print len(receivedMatrix)
	# print len(receivedMatrix["0"])
	# print type(receivedMatrix)
	# print receivedMatrix
	# print receivedMatrix["0"]["0"]

	# length = len(receivedMatrix)

	# X = [None] * length
	# degreeMatrix = [0] * length
	# for x in range(0,length):
	# 	X[x] = [None] * length
	# 	degreeMatrix[x] = [0] * length
	# 	tempDegree = 0
	# 	# print type(X),X
	# 	for y in range(0,length):
	# 		# print type(str(x)), type(x)
	# 		X[x][y] = receivedMatrix[str(x)][str(y)]
	# 		tempDegree = tempDegree + X[x][y]
	# 	degreeMatrix[x][x] = tempDegree

	
	# print (type(X))
	X = np.asarray(X)
	# degreeMatrix = np.asarray(degreeMatrix)
	# dInverse = np.linalg.inv(degreeMatrix)
	# dInverseSquareRoot = sp.linalg.sqrtm(dInverse)

	# laplacian = np.subtract(degreeMatrix, X)

	# # normalizedLaplacian = np.dot(dInverseSquareRoot, np.dot(laplacian,dInverseSquareRoot) )
	# normalizedLaplacian = laplacian
	# print normalizedLaplacian

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length

	for i in range(0, length):
		for j in range(0,length):
			returnMatrix[i][j] = X[i][j]

	a = {"message":"success", "matrix": returnMatrix}
	return json.dumps(a)

@app.route('/coauthorlink', methods=['GET','POST'])
@cross_origin()
def coauthorlink():

	# DATA_DIR = "/media/shivam/Shivam Data/Amit/augmentednodetrix/src/server_services/pythondata_cora"
	# DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata_cora"
	# DATA_DIR = "/media/shivam/Shivam Data/Amit/augmentednodetrix/src/server_services/pythondata"
	DATA_DIR = "/home/shivam/Desktop/Revisiting/server_services/pythondata"

	receivedIds = request.json["ids"]
	operation = request.json["operation"]
	length = len(receivedIds)
	print receivedIds

	X = [None] * length
	for x in range(0,length):
		X[x] = [None] * length	


	# dictGlobalIDAuthorName = pickle.load(open("./pythondata/authors_with_id_and_name.p","rb"))
	dictGlobalIDAuthorName = pickle.load(open(DATA_DIR+"/dictGlobalIDAuthorName.p","rb"))
	# print dictGlobalIDAuthorName


	if operation == 'actual':
		dictMatrix = pickle.load(open(DATA_DIR + "/total_future_co_authorship_matrix.p","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		print X
		print operation
	elif operation == 'prediction':

		predictedMatrix = [None] * length
		for x in range(0,length):
			predictedMatrix[x] = [None] * length	

		if(os.path.isfile(DATA_DIR+"/predicted.p") == False):
			predict.predictScript(DATA_DIR)

		predictDictMatrix = pickle.load(open(DATA_DIR + "/predicted.p","rb"))


		# dictMatrix = pickle.load(open(DATA_DIR + "","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				predictedMatrix[i][j] = predictDictMatrix[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]
		

		dictMatrix_Total_coauthorship = pickle.load(open(DATA_DIR + "/total_future_co_authorship_matrix.p","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix_Total_coauthorship[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]

		Y = [None] * length
		for x in range(0,length):
			Y[x] = [None] * length	

		dictMatrix_Infovis_coauthorship = pickle.load(open(DATA_DIR + "/co-authorship_dictionary_matrix.p","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				Y[i][j] = dictMatrix_Infovis_coauthorship[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]

		# Now subtracting the two matrices to show only future coauthorship exclluding infovis coauthorship
		# -1 represents error in data
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				if(X[i][j] > 0 and Y[i][j] > 0):
					X[i][j] = 0
				elif (X[i][j] == 0 and Y[i][j] == 0):
					X[i][j] = 0
				elif (X[i][j] > 0 and Y[i][j] <= 0):
					X[i][j] = 1
				elif (X[i][j] <= 0 and Y[i][j] > 0):
					X[i][j] = -1
				elif (X[i][j] < 0 and Y[i][j] <= 0):
					X[i][j] = -1
		# print X
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				if(predictedMatrix[i][j] > 0):
					predictedMatrix[i][j] = 1 #This must be gradient of similarity. But right now a quick HACK.!!!
				if(predictedMatrix[i][j] > 0 and X[i][j] > 0 and i!=j):
					predictedMatrix[i][j] = -2



		X = np.asarray(predictedMatrix)

		returnMatrix = [None] * length
		for i in range(0, length):
			returnMatrix[i] = [None] * length

		for i in range(0, length):
			for j in range(0,length):
				returnMatrix[i][j] = X[i][j]
				# if(X[i][j] > 0 and predictedMatrix[i][j] >0):
				# 	returnMatrix[i][j] = -2 #code to signify it is in sync with future coauthorship HACK

		print returnMatrix
		a = {"message":"success", "matrix": returnMatrix}
		return json.dumps(a)





	
	elif operation == 'future':
		dictMatrix_Total_coauthorship = pickle.load(open(DATA_DIR + "/total_future_co_authorship_matrix.p","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				X[i][j] = dictMatrix_Total_coauthorship[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]

		Y = [None] * length
		for x in range(0,length):
			Y[x] = [None] * length	

		dictMatrix_Infovis_coauthorship = pickle.load(open(DATA_DIR + "/co-authorship_dictionary_matrix.p","rb"))
		# print dictMatrix

		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				Y[i][j] = dictMatrix_Infovis_coauthorship[dictGlobalIDAuthorName[receivedIds[i]]['dataID']][dictGlobalIDAuthorName[receivedIds[j]]['dataID']]

		# Now subtracting the two matrices to show only future coauthorship exclluding infovis coauthorship
		# -1 represents error in data
		for i in range(0,len(receivedIds)):
			for j in range(0,len(receivedIds)):
				if(X[i][j] > 0 and Y[i][j] > 0):
					X[i][j] = 0
				elif (X[i][j] == 0 and Y[i][j] == 0):
					X[i][j] = 0
				elif (X[i][j] > 0 and Y[i][j] <= 0):
					X[i][j] = 1
				elif (X[i][j] <= 0 and Y[i][j] > 0):
					X[i][j] = -1
				elif (X[i][j] < 0 and Y[i][j] <= 0):
					X[i][j] = -1
		print X

	X = np.asarray(X)

	returnMatrix = [None] * length
	for i in range(0, length):
		returnMatrix[i] = [None] * length

	for i in range(0, length):
		for j in range(0,length):
			returnMatrix[i][j] = X[i][j]

	a = {"message":"success", "matrix": returnMatrix}
	return json.dumps(a)


		
if __name__ == '__main__':
    app.debug = True
    app.run()
    conn.close()