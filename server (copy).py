# import predict
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
import os
try:
  from SimpleHTTPServer import SimpleHTTPRequestHandler as Handler
  from SocketServer import TCPServer as Server
except ImportError:
  from http.server import SimpleHTTPRequestHandler as Handler
  from http.server import HTTPServer as Server

# Read port selected by the cloud for our application
PORT = int(os.getenv('PORT', 8000))
# Change current directory to avoid exposure of control files
os.chdir('static')

httpd = Server(("", PORT), Handler)
try:
  print("Start serving at port %i" % PORT)
  httpd.serve_forever()
except KeyboardInterrupt:
  pass

httpd.server_close()

