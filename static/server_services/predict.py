import pickle
def predictScript(DATA_DIR):
	coauthor = pickle.load(open(DATA_DIR + "/co-authorship_dictionary_matrix.p","rb"))
	cocitation = pickle.load(open(DATA_DIR + "/co-citation_authors_dictionary_matrix.p","rb"))
	authortopic = pickle.load(open(DATA_DIR + "/author_topic_dictionary_matrix.p","rb"))
	

	predicted={}
	length  = len(coauthor.keys())

	for key1,value1 in coauthor.items():
		predicted[key1] = {}
		for key2, value2 in coauthor[key1].items():
			predicted[key1][key2] = max(int(coauthor[key1][key2]), int(cocitation[key1][key2]), int(authortopic[key1][key2]))
			print predicted[key1][key2]

	pickle.dump( predicted, open( DATA_DIR + "/predicted.p", "wb" ) )
	# print predicted
	return
# predictScript("/media/shivam/Shivam Data/Amit/augmentednodetrix/src/server_services/pythondata")