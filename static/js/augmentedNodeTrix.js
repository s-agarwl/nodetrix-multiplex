function AugmentedNodeTrix(chartContainerID)
{
    var _chart = [];
    var _width = 500;
    var _height = 500;
    var _datasetMatrix = [];
    var _piecewiseDatasetMatrix = [];
    var _numberofNodes=0;
    var _clusteringList;
    var _focusNodeIndex = -1;
    var _focusNodeToFreeze = false;
    // var _overAllEdgeList = [{src:74,dst:13,cnt: 9},{src:74,dst:147,cnt: 7},{src:13,dst:147,cnt: 8},{src:110,dst:81,cnt: 2},{src:3,dst:79,cnt: 1},{src:3,dst:86,cnt: 1},{src:3,dst:131,cnt: 1},{src:79,dst:86,cnt: 1},{src:79,dst:131,cnt: 1},{src:86,dst:131,cnt: 1},{src:109,dst:110,cnt: 1},{src:109,dst:81,cnt: 4},{src:68,dst:142,cnt: 1},{src:68,dst:81,cnt: 1},{src:142,dst:81,cnt: 1},{src:80,dst:137,cnt: 1},{src:41,dst:58,cnt: 1},{src:41,dst:129,cnt: 1},{src:41,dst:74,cnt: 1},{src:58,dst:129,cnt: 1},{src:58,dst:74,cnt: 3},{src:129,dst:74,cnt: 1},{src:81,dst:88,cnt: 1},{src:2,dst:73,cnt: 2},{src:2,dst:45,cnt: 1},{src:2,dst:91,cnt: 1},{src:45,dst:91,cnt: 1},{src:2,dst:14,cnt: 1},{src:2,dst:16,cnt: 1},{src:14,dst:16,cnt: 2},{src:14,dst:73,cnt: 3},{src:16,dst:73,cnt: 4},{src:63,dst:74,cnt: 3},{src:10,dst:146,cnt: 1},{src:83,dst:81,cnt: 1},{src:17,dst:63,cnt: 2},{src:3,dst:82,cnt: 3},{src:67,dst:13,cnt: 1},{src:67,dst:147,cnt: 1},{src:6,dst:32,cnt: 1},{src:6,dst:42,cnt: 1},{src:6,dst:56,cnt: 1},{src:6,dst:63,cnt: 1},{src:6,dst:147,cnt: 1},{src:6,dst:74,cnt: 1},{src:6,dst:13,cnt: 1},{src:32,dst:42,cnt: 1},{src:32,dst:56,cnt: 1},{src:32,dst:63,cnt: 1},{src:32,dst:147,cnt: 1},{src:32,dst:74,cnt: 1},{src:32,dst:13,cnt: 1},{src:42,dst:56,cnt: 1},{src:42,dst:63,cnt: 1},{src:42,dst:147,cnt: 1},{src:42,dst:74,cnt: 1},{src:42,dst:13,cnt: 1},{src:56,dst:63,cnt: 1},{src:56,dst:147,cnt: 1},{src:56,dst:74,cnt: 1},{src:56,dst:13,cnt: 1},{src:63,dst:147,cnt: 1},{src:63,dst:13,cnt: 1},{src:14,dst:46,cnt: 1},{src:16,dst:46,cnt: 1},{src:46,dst:73,cnt: 2},{src:55,dst:77,cnt: 1},{src:109,dst:144,cnt: 1},{src:82,dst:146,cnt: 1},{src:17,dst:58,cnt: 1},{src:58,dst:63,cnt: 3},{src:89,dst:74,cnt: 1},{src:89,dst:147,cnt: 1},{src:5,dst:58,cnt: 3},{src:5,dst:63,cnt: 1},{src:54,dst:58,cnt: 1},{src:54,dst:108,cnt: 1},{src:54,dst:42,cnt: 1},{src:58,dst:108,cnt: 1},{src:58,dst:42,cnt: 1},{src:108,dst:42,cnt: 1},{src:48,dst:70,cnt: 1},{src:48,dst:92,cnt: 1},{src:48,dst:102,cnt: 1},{src:48,dst:81,cnt: 1},{src:70,dst:92,cnt: 1},{src:70,dst:102,cnt: 1},{src:70,dst:81,cnt: 1},{src:92,dst:102,cnt: 1},{src:92,dst:81,cnt: 1},{src:102,dst:81,cnt: 3},{src:91,dst:133,cnt: 1},{src:15,dst:18,cnt: 2},{src:15,dst:60,cnt: 2},{src:15,dst:143,cnt: 2},{src:15,dst:145,cnt: 2},{src:15,dst:139,cnt: 2},{src:18,dst:60,cnt: 3},{src:18,dst:143,cnt: 2},{src:18,dst:145,cnt: 2},{src:18,dst:139,cnt: 5},{src:60,dst:143,cnt: 2},{src:60,dst:145,cnt: 2},{src:60,dst:139,cnt: 3},{src:143,dst:145,cnt: 2},{src:143,dst:139,cnt: 2},{src:145,dst:139,cnt: 2},{src:66,dst:141,cnt: 3},{src:66,dst:81,cnt: 2},{src:141,dst:81,cnt: 2},{src:42,dst:103,cnt: 1},{src:8,dst:12,cnt: 1},{src:8,dst:27,cnt: 1},{src:8,dst:134,cnt: 1},{src:8,dst:82,cnt: 1},{src:12,dst:27,cnt: 1},{src:12,dst:134,cnt: 1},{src:12,dst:82,cnt: 1},{src:27,dst:134,cnt: 1},{src:27,dst:82,cnt: 1},{src:134,dst:82,cnt: 1},{src:16,dst:39,cnt: 1},{src:39,dst:73,cnt: 2},{src:1,dst:11,cnt: 1},{src:1,dst:19,cnt: 1},{src:1,dst:28,cnt: 1},{src:1,dst:49,cnt: 1},{src:1,dst:59,cnt: 1},{src:1,dst:101,cnt: 1},{src:1,dst:111,cnt: 1},{src:11,dst:19,cnt: 2},{src:11,dst:28,cnt: 3},{src:11,dst:49,cnt: 3},{src:11,dst:59,cnt: 1},{src:11,dst:101,cnt: 1},{src:11,dst:111,cnt: 1},{src:19,dst:28,cnt: 2},{src:19,dst:49,cnt: 2},{src:19,dst:59,cnt: 1},{src:19,dst:101,cnt: 1},{src:19,dst:111,cnt: 1},{src:28,dst:49,cnt: 4},{src:28,dst:59,cnt: 1},{src:28,dst:101,cnt: 1},{src:28,dst:111,cnt: 1},{src:49,dst:59,cnt: 1},{src:49,dst:101,cnt: 1},{src:49,dst:111,cnt: 1},{src:59,dst:101,cnt: 1},{src:59,dst:111,cnt: 1},{src:101,dst:111,cnt: 1},{src:46,dst:71,cnt: 1},{src:71,dst:73,cnt: 1},{src:52,dst:72,cnt: 1},{src:52,dst:74,cnt: 1},{src:72,dst:74,cnt: 1},{src:5,dst:13,cnt: 1},{src:5,dst:64,cnt: 1},{src:5,dst:139,cnt: 2},{src:5,dst:74,cnt: 1},{src:13,dst:58,cnt: 1},{src:13,dst:64,cnt: 1},{src:13,dst:139,cnt: 1},{src:58,dst:64,cnt: 1},{src:58,dst:139,cnt: 2},{src:64,dst:139,cnt: 1},{src:64,dst:74,cnt: 1},{src:139,dst:74,cnt: 2},{src:11,dst:40,cnt: 1},{src:11,dst:47,cnt: 1},{src:11,dst:51,cnt: 1},{src:11,dst:84,cnt: 1},{src:11,dst:105,cnt: 1},{src:28,dst:40,cnt: 1},{src:28,dst:47,cnt: 1},{src:28,dst:51,cnt: 1},{src:28,dst:84,cnt: 1},{src:28,dst:105,cnt: 2},{src:40,dst:47,cnt: 1},{src:40,dst:49,cnt: 1},{src:40,dst:51,cnt: 1},{src:40,dst:84,cnt: 1},{src:40,dst:105,cnt: 1},{src:47,dst:49,cnt: 1},{src:47,dst:51,cnt: 1},{src:47,dst:84,cnt: 1},{src:47,dst:105,cnt: 1},{src:49,dst:51,cnt: 1},{src:49,dst:84,cnt: 1},{src:49,dst:105,cnt: 1},{src:51,dst:84,cnt: 1},{src:51,dst:105,cnt: 1},{src:84,dst:105,cnt: 1},{src:3,dst:21,cnt: 1},{src:3,dst:33,cnt: 1},{src:3,dst:69,cnt: 1},{src:21,dst:33,cnt: 1},{src:21,dst:69,cnt: 1},{src:21,dst:82,cnt: 1},{src:33,dst:69,cnt: 1},{src:33,dst:82,cnt: 1},{src:69,dst:82,cnt: 1},{src:75,dst:146,cnt: 1},{src:90,dst:146,cnt: 1},{src:29,dst:37,cnt: 1},{src:29,dst:44,cnt: 1},{src:29,dst:128,cnt: 1},{src:29,dst:135,cnt: 1},{src:29,dst:147,cnt: 1},{src:37,dst:44,cnt: 1},{src:37,dst:128,cnt: 1},{src:37,dst:135,cnt: 1},{src:37,dst:147,cnt: 1},{src:44,dst:128,cnt: 1},{src:44,dst:135,cnt: 1},{src:44,dst:147,cnt: 1},{src:128,dst:135,cnt: 1},{src:128,dst:147,cnt: 1},{src:135,dst:147,cnt: 1},{src:72,dst:148,cnt: 1},{src:81,dst:74,cnt: 1},{src:81,dst:13,cnt: 1},{src:9,dst:102,cnt: 2},{src:25,dst:28,cnt: 1},{src:25,dst:50,cnt: 1},{src:28,dst:50,cnt: 1},{src:104,dst:81,cnt: 1},{src:20,dst:31,cnt: 1},{src:20,dst:82,cnt: 1},{src:31,dst:82,cnt: 1},{src:65,dst:85,cnt: 1},{src:7,dst:4,cnt: 1},{src:43,dst:82,cnt: 1},{src:43,dst:81,cnt: 2},{src:82,dst:81,cnt: 1},{src:0,dst:36,cnt: 1},{src:0,dst:113,cnt: 1},{src:0,dst:81,cnt: 1},{src:36,dst:113,cnt: 1},{src:36,dst:81,cnt: 1},{src:113,dst:81,cnt: 1},{src:26,dst:65,cnt: 1},{src:26,dst:72,cnt: 1},{src:65,dst:72,cnt: 1},{src:16,dst:57,cnt: 1},{src:57,dst:73,cnt: 1},{src:18,dst:22,cnt: 2},{src:22,dst:60,cnt: 1},{src:22,dst:139,cnt: 2},{src:72,dst:78,cnt: 1},{src:102,dst:132,cnt: 1},{src:132,dst:81,cnt: 1},{src:52,dst:87,cnt: 1},{src:52,dst:106,cnt: 1},{src:52,dst:107,cnt: 1},{src:87,dst:106,cnt: 1},{src:87,dst:107,cnt: 1},{src:106,dst:107,cnt: 1},{src:30,dst:102,cnt: 1},{src:30,dst:81,cnt: 1},{src:61,dst:76,cnt: 1},{src:61,dst:80,cnt: 1},{src:61,dst:13,cnt: 1},{src:76,dst:80,cnt: 1},{src:76,dst:13,cnt: 1},{src:80,dst:13,cnt: 1},{src:118,dst:119,cnt: 1},{src:118,dst:126,cnt: 2},{src:118,dst:46,cnt: 1},{src:119,dst:126,cnt: 1},{src:119,dst:46,cnt: 1},{src:126,dst:46,cnt: 2},{src:127,dst:138,cnt: 1},{src:24,dst:99,cnt: 1},{src:24,dst:100,cnt: 1},{src:24,dst:77,cnt: 1},{src:99,dst:100,cnt: 1},{src:99,dst:77,cnt: 1},{src:100,dst:77,cnt: 1},{src:53,dst:95,cnt: 1},{src:53,dst:114,cnt: 1},{src:53,dst:115,cnt: 1},{src:53,dst:116,cnt: 1},{src:53,dst:123,cnt: 1},{src:53,dst:125,cnt: 1},{src:53,dst:126,cnt: 1},{src:95,dst:114,cnt: 1},{src:95,dst:115,cnt: 1},{src:95,dst:116,cnt: 1},{src:95,dst:123,cnt: 1},{src:95,dst:125,cnt: 1},{src:95,dst:126,cnt: 1},{src:114,dst:115,cnt: 1},{src:114,dst:116,cnt: 1},{src:114,dst:123,cnt: 1},{src:114,dst:125,cnt: 1},{src:114,dst:126,cnt: 1},{src:115,dst:116,cnt: 1},{src:115,dst:123,cnt: 1},{src:115,dst:125,cnt: 1},{src:115,dst:126,cnt: 1},{src:116,dst:123,cnt: 1},{src:116,dst:125,cnt: 1},{src:116,dst:126,cnt: 1},{src:123,dst:125,cnt: 1},{src:123,dst:126,cnt: 1},{src:125,dst:126,cnt: 1},{src:124,dst:139,cnt: 1},{src:124,dst:22,cnt: 1},{src:124,dst:18,cnt: 1},{src:34,dst:118,cnt: 1},{src:34,dst:126,cnt: 1},{src:46,dst:72,cnt: 1},{src:140,dst:127,cnt: 1},{src:38,dst:82,cnt: 1},{src:77,dst:117,cnt: 1},{src:77,dst:147,cnt: 1},{src:117,dst:147,cnt: 1},{src:35,dst:39,cnt: 1},{src:35,dst:73,cnt: 1},{src:35,dst:120,cnt: 1},{src:39,dst:120,cnt: 1},{src:73,dst:120,cnt: 1},{src:57,dst:98,cnt: 1},{src:57,dst:121,cnt: 1},{src:98,dst:121,cnt: 1},{src:62,dst:94,cnt: 1},{src:62,dst:130,cnt: 1},{src:62,dst:42,cnt: 1},{src:94,dst:130,cnt: 1},{src:94,dst:42,cnt: 1},{src:130,dst:42,cnt: 1},{src:96,dst:104,cnt: 2},{src:96,dst:112,cnt: 1},{src:104,dst:112,cnt: 1},{src:96,dst:97,cnt: 1},{src:97,dst:104,cnt: 1},{src:72,dst:127,cnt: 1},{src:82,dst:102,cnt: 1},{src:82,dst:122,cnt: 1},{src:102,dst:122,cnt: 1},{src:105,dst:13,cnt: 1},{src:4,dst:28,cnt: 1},{src:4,dst:49,cnt: 1},{src:93,dst:81,cnt: 1},{src:93,dst:136,cnt: 1},{src:23,dst:72,cnt: 1}]
    var _overAllEdgeList = window.edgeList;
    var _edgeList_layer3 = window.edgeList_layer3;
    var _shortlistedEdgeList_layer3 = [];
    var _layer3_Edges_ByMatrices = [];

    var _shortlistedEdgeList=[];
    var _shortlistedEdgeListByMatrices = [];
    var _tickTimer;
    var _tickFlag=false;
    var _showLayer3Edge = true;
    var _showLayer3Edge1 = false;
    


    // Original data set ordering
    //var _overAllLabelsList                    = [{name: "Callahan",id: 0},{name: "Su",id: 1},{name: "Goldstein",id: 2},{name: "Hollan",id: 3},{name: "Landay",id: 4},{name: "Pitkow",id: 5},{name: "Pedersen",id: 6},{name: "Hong",id: 7},{name: "Stewart",id: 8},{name: "Fekete",id: 9},{name: "Zacks",id: 10},{name: "Aiken",id: 11},{name: "Hollan",id: 12},{name: "Mackinlay",id: 13},{name: "Mattis",id: 14},{name: "Carlis",id: 15},{name: "Kolojejchick",id: 16},{name: "Lamping",id: 17},{name: "Riedl",id: 18},{name: "Chen",id: 19},{name: "Meyer",id: 20},{name: "Helfman",id: 21},{name: "Konstan",id: 22},{name: "Steffen",id: 23},{name: "Claffy",id: 24},{name: "Kuchinsky",id: 25},{name: "Wilks",id: 26},{name: "Druin",id: 27},{name: "Woodruff",id: 28},{name: "Larson",id: 29},{name: "Doan",id: 30},{name: "Good",id: 31},{name: "Masinter",id: 32},{name: "Ring",id: 33},{name: "Derthick",id: 34},{name: "Moore",id: 35},{name: "Weiser",id: 36},{name: "Dantzich",id: 37},{name: "Boltman",id: 38},{name: "Derthick",id: 39},{name: "Lin",id: 40},{name: "Stefik",id: 41},{name: "Hearst",id: 42},{name: "Wattenberg",id: 43},{name: "Czerwinski",id: 44},{name: "Goldberg",id: 45},{name: "Chuah",id: 46},{name: "Chu",id: 47},{name: "Rose",id: 48},{name: "Stonebraker",id: 49},{name: "Baldonado",id: 50},{name: "Spalding",id: 51},{name: "Gershon",id: 52},{name: "Lucas",id: 53},{name: "Schank",id: 54},{name: "Burchard",id: 55},{name: "Halvorsen",id: 56},{name: "Lucas",id: 57},{name: "Pirolli",id: 58},{name: "Wisnovsky",id: 59},{name: "Barry",id: 60},{name: "Zellweger",id: 61},{name: "Dhamija",id: 62},{name: "Rao",id: 63},{name: "Gossweiler",id: 64},{name: "Becker",id: 65},{name: "Beigel",id: 66},{name: "DeLine",id: 67},{name: "Botafogo",id: 68},{name: "Hightower",id: 69},{name: "Widoff",id: 70},{name: "Kerpedjiev",id: 71},{name: "Eick",id: 72},{name: "Roth",id: 73},{name: "Card",id: 74},{name: "Jul",id: 75},{name: "Igarashi",id: 76},{name: "Munzner",id: 77},{name: "Ball",id: 78},{name: "McCandless",id: 79},{name: "Chang",id: 80},{name: "Shneiderman",id: 81},{name: "Bederson",id: 82},{name: "Jain",id: 83},{name: "Ercegovac",id: 84},{name: "Cleveland",id: 85},{name: "Hill",id: 86},{name: "Ruh",id: 87},{name: "Weiland",id: 88},{name: "York",id: 89},{name: "Zhang",id: 90},{name: "Myers",id: 91},{name: "Milash",id: 92},{name: "Johnson",id: 93},{name: "Yee",id: 94},{name: "Senn",id: 95},{name: "Conklin",id: 96},{name: "Prabhakar",id: 97},{name: "Higgins",id: 98},{name: "Fenner",id: 99},{name: "Hoffman",id: 100},{name: "Paxson",id: 101},{name: "Plaisant",id: 102},{name: "Karadi",id: 103},{name: "North",id: 104},{name: "Olston",id: 105},{name: "Winstead",id: 106},{name: "Levasseur",id: 107},{name: "Diehl",id: 108},{name: "Ahlberg",id: 109},{name: "Williamson",id: 110},{name: "Taylor",id: 111},{name: "Saini",id: 112},{name: "Hopkins",id: 113},{name: "Kolojechick",id: 114},{name: "Dunmire",id: 115},{name: "Gomberg",id: 116},{name: "Guimbretiere",id: 117},{name: "Kolojejchick",id: 118},{name: "Mattis",id: 119},{name: "Harrison",id: 120},{name: "Senn",id: 121},{name: "Grosjean",id: 122},{name: "Burks",id: 123},{name: "Barry",id: 124},{name: "Stroffolino",id: 125},{name: "Roth",id: 126},{name: "Keahey",id: 127},{name: "Robbins",id: 128},{name: "Russell",id: 129},{name: "Fisher",id: 130},{name: "Wroblewski",id: 131},{name: "Carr",id: 132},{name: "Kosbie",id: 133},{name: "Proft",id: 134},{name: "Thiel",id: 135},{name: "Turo",id: 136},{name: "Ungar",id: 137},{name: "Robertson",id: 138},{name: "Chi",id: 139},{name: "Robertson",id: 140},{name: "Tanin",id: 141},{name: "Rivlin",id: 142},{name: "Shoop",id: 143},{name: "Wistrand",id: 144},{name: "Retzel",id: 145},{name: "Furnas",id: 146},{name: "Robertson",id: 147},{name: "Wills",id: 148}]
    // Ordering of names based on pre clustered dataset
    // var _overAllLabelsList                    = [ {name: "Roth",id: 126},{name: "Lucas",id: 53},{name: "Burks",id: 123},{name: "Stroffolino",id: 125},{name: "Kolojechick",id: 114},{name: "Senn",id: 95},{name: "Dunmire",id: 115},{name: "Gomberg",id: 116},{name: "Kolojejchick",id: 118},{name: "Mattis",id: 119},{name: "Derthick",id: 34},{name: "Kerpedjiev",id: 71},{name: "Lucas",id: 57},{name: "Goldstein",id: 2},{name: "Chuah",id: 46},{name: "Mattis",id: 14},{name: "Roth",id: 73},{name: "Kolojejchick",id: 16},{name: "Derthick",id: 39},{name: "Moore",id: 35},{name: "Harrison",id: 120},{name: "Senn",id: 121},{name: "Higgins",id: 98},{name: "Goldberg",id: 45},{name: "Myers",id: 91},{name: "Kosbie",id: 133},{name: "Eick",id: 72},{name: "Becker",id: 65},{name: "Wilks",id: 26},{name: "Ball",id: 78},{name: "Steffen",id: 23},{name: "Keahey",id: 127},{name: "Wills",id: 148},{name: "Cleveland",id: 85},{name: "Robertson",id: 140},{name: "Robertson",id: 138},{name: "Winstead",id: 106},{name: "Ruh",id: 87},{name: "Levasseur",id: 107},{name: "Gershon",id: 52},{name: "Bederson",id: 82},{name: "Hollan",id: 3},{name: "Hightower",id: 69},{name: "Helfman",id: 21},{name: "Ring",id: 33},{name: "Druin",id: 27},{name: "Proft",id: 134},{name: "Stewart",id: 8},{name: "Hollan",id: 12},{name: "Grosjean",id: 122},{name: "Wroblewski",id: 131},{name: "McCandless",id: 79},{name: "Hill",id: 86},{name: "Furnas",id: 146},{name: "Zhang",id: 90},{name: "Zacks",id: 10},{name: "Jul",id: 75},{name: "Good",id: 31},{name: "Meyer",id: 20},{name: "Boltman",id: 38},{name: "Wattenberg",id: 43},{name: "Plaisant",id: 102},{name: "Milash",id: 92},{name: "Widoff",id: 70},{name: "Rose",id: 48},{name: "Carr",id: 132},{name: "Doan",id: 30},{name: "Fekete",id: 9},{name: "Shneiderman",id: 81},{name: "Hopkins",id: 113},{name: "Weiser",id: 36},{name: "Callahan",id: 0},{name: "Beigel",id: 66},{name: "Tanin",id: 141},{name: "Weiland",id: 88},{name: "Williamson",id: 110},{name: "Rivlin",id: 142},{name: "Botafogo",id: 68},{name: "Jain",id: 83},{name: "Ahlberg",id: 109},{name: "Wistrand",id: 144},{name: "Johnson",id: 93},{name: "Turo",id: 136},{name: "North",id: 104},{name: "Saini",id: 112},{name: "Conklin",id: 96},{name: "Prabhakar",id: 97},{name: "Paxson",id: 101},{name: "Wisnovsky",id: 59},{name: "Chen",id: 19},{name: "Taylor",id: 111},{name: "Su",id: 1},{name: "Stonebraker",id: 49},{name: "Woodruff",id: 28},{name: "Aiken",id: 11},{name: "Chu",id: 47},{name: "Spalding",id: 51},{name: "Lin",id: 40},{name: "Ercegovac",id: 84},{name: "Olston",id: 105},{name: "Landay",id: 4},{name: "Hong",id: 7},{name: "Baldonado",id: 50},{name: "Kuchinsky",id: 25},{name: "Carlis",id: 15},{name: "Barry",id: 60},{name: "Retzel",id: 145},{name: "Riedl",id: 18},{name: "Shoop",id: 143},{name: "Konstan",id: 22},{name: "Barry",id: 124},{name: "Chi",id: 139},{name: "Gossweiler",id: 64},{name: "Pitkow",id: 5},{name: "Pirolli",id: 58},{name: "Card",id: 74},{name: "Hearst",id: 42},{name: "Rao",id: 63},{name: "Pedersen",id: 6},{name: "Halvorsen",id: 56},{name: "Masinter",id: 32},{name: "Mackinlay",id: 13},{name: "Robertson",id: 147},{name: "Robbins",id: 128},{name: "Dantzich",id: 37},{name: "Thiel",id: 135},{name: "Czerwinski",id: 44},{name: "Larson",id: 29},{name: "Stefik",id: 41},{name: "Russell",id: 129},{name: "Lamping",id: 17},{name: "Diehl",id: 108},{name: "Schank",id: 54},{name: "Dhamija",id: 62},{name: "Yee",id: 94},{name: "Fisher",id: 130},{name: "York",id: 89},{name: "Karadi",id: 103},{name: "Igarashi",id: 76},{name: "Zellweger",id: 61},{name: "Chang",id: 80},{name: "Ungar",id: 137},{name: "DeLine",id: 67},{name: "Burchard",id: 55},{name: "Fenner",id: 99},{name: "Hoffman",id: 100},{name: "Claffy",id: 24},{name: "Munzner",id: 77},{name: "Guimbretiere",id: 117} ];    
    //var _overAllLabelsList                    = d3.range(150);
    //var _overAllLabelsList                      = [{name: "1",id: 1},{name: "2",id: 2},{name: "3",id: 3},{name: "4",id: 4},{name: "5",id: 5},{name: "6",id: 6},{name: "7",id: 7},{name: "8",id: 8},{name: "9",id: 9},{name: "10",id: 10},{name: "11",id: 11},{name: "12",id: 12},{name: "13",id: 13},{name: "14",id: 14},{name: "15",id: 15},{name: "16",id: 16},{name: "17",id: 17},{name: "18",id: 18},{name: "19",id: 19},{name: "20",id: 1} ]
    var _chartContainerID = chartContainerID;
    var node;
    AugmentedNodeTrix.globalScaleFactor = 1;
    AugmentedNodeTrix.edgeWeightBaseWidth = 4;

    window.globalCount=1;
    AugmentedNodeTrix._currentHighlightedPair = {
        src: -1,
        dst: -1
    };
    AugmentedNodeTrix._parentID = 'topParent';
    AugmentedNodeTrix._glyphType = 'rect';
    AugmentedNodeTrix._colorScaleStart = 'black';
    AugmentedNodeTrix._colorScaleEnd = 'white';
    AugmentedNodeTrix._communityDetection = false;
    AugmentedNodeTrix._beta = 1.0;
    AugmentedNodeTrix._LABColorSpace = false;


    var render = renderQueue(drawPath2)
                    .rate(1)
                    .clear(function(){
                        d3.selectAll('#' + AugmentedNodeTrix._parentID +
                        ' .bezierCurves').remove();
                      });
    var render_layer3 = renderQueue(drawPath_Multilayer2)
                        .rate(30)
                        .clear(function(){
                            d3.selectAll('#' + AugmentedNodeTrix._parentID +
                            ' .layer3').remove();
                          });
    function chart()
    {
        return this;
    }

   
    testingShape = function(index)
    {
        d3.select("#matrix" + index + " .parentGroup").remove();
        _chart[index].testingMatrixShapeChang();
        return chart;
    }

    chart.modifySize = function()
    {
        _chart[0].modifySize();
        return this;
    }

    chart.width = function(width)
    {
        if (undefined != width)
        {
            _width = width;
            return chart;
        }
        else
        {
            return _width;
        }
    }
    chart.height = function(height)
    {
        if (undefined != height)
        {
            _height = height;
            return chart;
        }
        else
        {
            return _height;
        }
    }

    function saveAsPNG(id)
    {
           
          Pablo('#'+id).download('png', 'svgImage.png', function(result){
        // alert(result.error ? 'Fail' : 'Success');
        if(result.error)
        {
            console.log("download failed");
        }
        else
        {
            console.log("svg image download complete");
        }
    });
      
    

        
    }


    chart.focusNode = function(index)
    {
        _focusNodeIndex = index;
        prevState = _chart[_focusNodeIndex].getState();
        // console.log(prevState);
        if (prevState == "freezed")
        {
            // console.log("here");
            _focusNodeToFreeze = true;
            $("#" + freezeCheckboxID).attr('checked', 'true');
        }
        else if (prevState == "none")
        {
            _focusNodeToFreeze = false;
        }

        //Shivam-To correct right arrow behavior
          rightSidebarToggler();

        // rerenderMultilayerPaths1(_focusNodeIndex);  
        _chart[_focusNodeIndex].focusNode();
        return this;
    }
    chart.deFocusNode = function()
    {

        if (_focusNodeIndex != -1)
        {
            if ($("#test2").attr("data-status") == "opened")
            {
                $("#test2.container.sidebar.sidebar-right").find(
                    ".toggler").trigger("click");
                $("#test2.container.sidebar.sidebar-right").find(".toggler").hide();
            }
            if (_focusNodeIndex != -1)
            {
                if (_focusNodeToFreeze) _chart[_focusNodeIndex].deFocusNode(
                    "freezed");
                else _chart[_focusNodeIndex].deFocusNode("none");
            }
            else console.log(
                "ERROR: focussed node index is not recorded");
            _focusNodeIndex = -1;

            // removeMultilayerPaths(_focusNodeIndex);
        }
        return this;
    }
    chart.loadClusteringInfo = function(clusteringList)
    {
        _clusteringList = clusteringList;
        return chart;
    }

    function parseData(entireDataset)
    {
        // console.log(entireDataset);
        // dataset = entireDataset.DissimilarityMatrices;
        dataset = entireDataset["DissimilarityMatrices"];
        datasetAdj = entireDataset["AdjacencyMatrices"];
        datasetEigenMatrices = entireDataset["EigenMatrices"];
        cleanedMatrices = [];
        for (var i = 0; i < dataset.length;)
        {
            //Creating temporary Matrix
            temp_row = parseInt(dataset[i][0]);
            temp_column = parseInt(dataset[i][1]);
            temp_matrix = new Array(temp_row);
            _numberofNodes += temp_row;
            for (var j = 0; j < temp_row; j++)
            {
                temp_matrix[j] = new Array(temp_column);
            }
            temp_matrix_adj = new Array(temp_row);
            for (var j = 0; j < temp_row; j++)
            {
                temp_matrix_adj[j] = new Array(temp_column);
            }
            temp_matrix_eigen = new Array(temp_row);
            for (var j = 0; j < temp_row; j++)
            {
                temp_matrix_eigen[j] = new Array(temp_column);
            }
            rowLabels = [];
            columnLabels = [];
            // Populating Row Labels
            for (var j = 0; j < dataset[i + 1].length; j = j + 2)
            {
                temp_Label = {
                    name: dataset[i + 1][j],
                    id: parseInt(dataset[i + 1][j + 1])
                };
                rowLabels.push(temp_Label);
            }
            // Populating Column Labels
            for (var j = 0; j < dataset[i + 2].length; j = j + 2)
            {
                temp_Label = {
                    name: dataset[i + 2][j],
                    id: parseInt(dataset[i + 2][j + 1])
                };
                columnLabels.push(temp_Label);
            }
            // Populating Matrix
            for (var j = 0; j < temp_row; j++)
            {
                for (var k = 0; k < temp_column; k++)
                {
                    temp_matrix[j][k] =  parseFloat(dataset[i + 3 + j][k]);
                    temp_matrix_adj[j][k] = parseFloat(datasetAdj[i + 3 +
                        j][k]);
                    temp_matrix_eigen[j][k] = parseFloat(datasetEigenMatrices[i + 3 + j][k]);
                    // console.log(i,j,k);
                }
            }
            temp_matrix_unnormalizedAdjacencyMatrix = jQuery.extend(true, [], temp_matrix);
            temp_matrix = normalize_Matrix(temp_matrix, temp_row,
                temp_column);
            temp_matrix_adj = normalize_Matrix(temp_matrix_adj,
                temp_row, temp_column);


            // This is shit code to associate black color with 0 inspite the actual value is 1
            for (var j = 0; j < temp_row; j++)
            {
                for (var k = 0; k < temp_column; k++)
                {
                    temp_matrix[j][k] =  1- temp_matrix[j][k]
                    temp_matrix_adj[j][k] = 1- temp_matrix_adj[j][k]
                    // console.log(i,j,k);
                }
            }

            temp_matrix = normalize_Matrix(temp_matrix, temp_row,
                temp_column);
            temp_matrix_adj = normalize_Matrix(temp_matrix_adj,
                temp_row, temp_column);

            // --------SHIT CODE ENDS-------------


            
            temp_var = {
                dissimilarityMatrix: temp_matrix,
                adjacencyMatrix: temp_matrix_adj,
                eigenMatrix: temp_matrix_eigen,
                weightMatrix: temp_matrix_unnormalizedAdjacencyMatrix,
                rowSize: temp_row,
                columnSize: temp_column,
                rowLabels: rowLabels,
                columnLabels: columnLabels
            };
            // console.log(temp_matrix_adj);
            cleanedMatrices.push(temp_var);
            i = i + 3 + temp_row;
        }
        return cleanedMatrices;
    }

    function normalize_Matrix(inputMatrix, rowSize, colSize)
    {
        var max = -1000, min = 100000;
        for (var i= 0; i< rowSize; i++)
        {
            for (var j= 0; j< colSize; j++)
            {
                inputMatrix[i][j] > max ? max = inputMatrix[i][j] :  {};
                inputMatrix[i][j] < min ? min = inputMatrix[i][j] :  {};
            }
        }
        if (min == max && 0 == min)
        {}
        else
        {
            // Normalize betwen 0 and 1
            for (var i= 0; i< rowSize; i++)
            {
                for (var j= 0; j< colSize; j++)
                {
                    if (min == max) 
                        inputMatrix[i][j] = 1;
                    else
                    // inputMatrix[i+initialPos][j+initialPos] = i== j? 0 : (inputMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;
                        inputMatrix[i][j] = i==j? 0: (( inputMatrix[i][j] - min) / (max - min));
                }
            }
        }
        // console.log("Processed normalized matrix: ", inputMatrix);
        return inputMatrix;
    }

    
    chart.loadMatrix = function(dataSet)
    {
        _piecewiseDatasetMatrix.length = 0;
        _datasetMatrix = dataSet;
        // console.log("dataset", dataSet);
        cleanedMatrices = parseData(dataSet);
        for (var i = 0; i < cleanedMatrices.length; i++)
        {
            _piecewiseDatasetMatrix.push(
            {
                a: cleanedMatrices[i]
            });
        }
        // var arrayInitialPos = 0;      
        // // Generate individual matrices out of combined one and fill in the piecewise dataset matrix.
        // for( var k = 0; k < _clusteringList.length ; ++k )
        // {        
        //       var matrixSize =  _clusteringList[k] - arrayInitialPos;  
        //       var matrix     =  new Array(matrixSize);
        //       var labelsList =  new Array(matrixSize);            
        //       for (var i = 0; i < matrixSize; i++)   
        //       {
        //           matrix[i]     = new Array(matrixSize);
        //           labelsList[i] = _overAllLabelsList[arrayInitialPos+i];
        //       }
        //       for (var i = 0; i < matrixSize; i++)   
        //           for (var j = 0; j < matrixSize; j++)   
        //               matrix[i][j] =  _datasetMatrix[i+arrayInitialPos][j+arrayInitialPos];
        //       var data = { matrixData: matrix , labelsData: labelsList };
        //       _piecewiseDatasetMatrix.push({a:data});
        //       arrayInitialPos = _clusteringList[k];
        // }
        return chart;
    }

    chart.applyModularity = function(index)
    {
         if (typeof index === 'undefined')
         {
            for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
            {
                _chart[i].applyModularity();
            }
         }
         else
         {
            _chart[index].applyModularity();
         }
         return chart;
    }

    chart.applyPower2 = function(index)
    {
         if (typeof index === 'undefined')
         {
            for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
            {
                _chart[i].applyPower2();
            }
         }
         else
         {
            _chart[index].applyPower2();
         }
         return chart;
    }

    chart.applyClustering = function(dimensions, clusters, index)
    {
        if (typeof index === 'undefined')
        {
            // for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
            // {
            //     d3.select("#matrix"+index+" .parentGroup").remove();
            //     _chart[i].applyClustering(dimensions, clusters);
            // }
        }
        else
        {
             // var myData = {
             //          "data": {
             //            "description": "b", 
             //            "name": "a"
             //          }
             //        };

           
            // $.ajax({

            //         url: 'http://localhost:5000/foo',
            //         data: myData,
            //         type: 'GET',
            //         crossDomain: true,
            //         dataType: 'jsonp',
            //         success: function() { alert("Success"); },
            //         error: function() { alert('Failed!'); }
            //         // beforeSend: setHeader
            //     });
            
              
            type = $("#typeOfClustering").val();
            d3.select("#matrix" + index + " .parentGroup").remove();
            _chart[index].applyClustering(dimensions, clusters, type);
            _focusNodeToFreeze = true;
        }
        populateSidebar(index);
        return chart;
    }
    chart.updateValueFiltering = function(beta, index)
    {
        if (typeof index === 'undefined')
        {
            AugmentedNodeTrix._beta = beta;
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].updateValueFiltering(
                    beta);
        }
        else
        {
            _chart[index].updateValueFiltering(beta);
        }
    }
    chart.updateData = function(data)
    {
        _datasetMatrix = data;
        this.loadMatrix(data);
        var topParent = d3.select('#' + _chartContainerID).selectAll(
            ".node svg").data(_piecewiseDatasetMatrix.map(function(
            data)
        {
            return data.a
        })).each(function(data, index)
        {
            _chart[index].updateData(data)
        });
        return chart;
    }
    chart.updateColorSpace = function(colorSpace)
    {
        if ('Lab' == colorSpace)
        {
            AugmentedNodeTrix._LABColorSpace = true;
        }
        else
        {
            AugmentedNodeTrix._LABColorSpace = false;
        }
        for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[
            i].updateColorScale(AugmentedNodeTrix._colorScaleStart,
            AugmentedNodeTrix._colorScaleEnd)
    }
    function rightSidebarToggler()
    {
         $(".glyphicon-chevron-left").hide();
        $(".glyphicon-chevron-right").show();
       
    }
    function populateSidebar(index)
    {
        // console.log($("#test2.container.sidebar.sidebar-right").find(".toggler"));
        if ($("#test2").attr("data-status") == "closed")
        {
            $("#test2.container.sidebar.sidebar-right").find(".toggler").show();
            $("#test2.container.sidebar.sidebar-right").find(".toggler")
            .click();
            // console.log($("#test2.container.sidebar.sidebar-right").find(".toggler").click());
          
            

                // .trigger("click");
        }
        if (_chart[index].isSquareMAtrix())
        {
            var template = $('#hidden-template').html();
            $('#test2').empty();
            $('#test2').append(originalSidebar);
            $('#test2').append(template);
            window.freezeCheckboxID = "state";
            // $( "#state" ).button();
            $("#sidebar-color").selectmenu();
            $("#sidebar-matrix").selectmenu();
            // $( "#sidebar-matrixSeriation" ).selectmenu();
            // $( "#sidebar-glyph" ).selectmenu();
            $('#state').mousedown(function()
            {
                if (!$(this).is(':checked'))
                {
                    _focusNodeToFreeze = true;
                    // visualization.updateColorSpace('Lab')
                }
                else
                {
                    _focusNodeToFreeze = false;
                    // visualization.updateColorSpace('')
                }
            });

           

            // No need of complement matrix operation now

            // $('#complement').mousedown(function()
            // {
            //     if (!$(this).is(':checked'))
            //     {
            //         console.log("complement pressed");
            //         _chart[index].setComplementMatrix(true);
            //         _chart[index].updateMatrixByComplement();
            //         // _focusNodeToFreeze = true;
            //         // visualization.updateColorSpace('Lab')
            //     }
            //     else
            //     {
            //         _chart[index].setComplementMatrix(false);
            //            _chart[index].updateMatrixByComplement();
            //         // _chart[index].restoreOriginalMatrix();
            //         // _focusNodeToFreeze = false;
            //         // visualization.updateColorSpace('')
            //     }
            // });

            $("#sidebar-matrix").selectmenu(
            {
                select: function(event, ui)
                {
                    _matrixSeriationType = ui.item.value;

                    if (ui.item.value == 'VATed')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyVAT(index);
                    }
                    else if (ui.item.value == 'Leaf')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyLeaf(index);
                    }
                    else if (ui.item.value == 'CrossingReduction')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyCrossingReduction(index);
                    }
                    else if (ui.item.value == 'BandwidthReduction')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyBandwidthReduction(index);
                    }
                     else if (ui.item.value == 'CLUSION')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyCLUSION(index);
                    }
                    else if (ui.item.value == 'Self')
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.restoreOriginalMatrix(
                            index);
                    }
                    else if (ui.item.value == "Lap")
                    {
                        // console.log(visualization);
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyLaplacian(index);
                        // visualization.updateData(laplacianMatrix);
                    }
                     else if (ui.item.value == "Pow")
                    {
                        // console.log(visualization);
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyPower2(index);
                        // visualization.updateData(laplacianMatrix);
                    }
                    else if (ui.item.value == "Fil")
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        $("#sidebar-filter").attr("style",
                            "display:block;");
                    }
                    else if (ui.item.value == "Mod")
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        visualization.applyModularity(index);
                    }
                    else if (ui.item.value == "Clu")
                    {
                        refreshSidebar(
                            focusSidebarRefreshIdArray);
                        $("#clusterOptions").attr("style",
                            "display:block;");
                        $(function()
                        {
                            $("#typeOfClustering").selectmenu();
                            $("#spinner1").spinner();
                            $("#spinner2").spinner();
                            $("button").button();
                        });
                    }
                    $('#sidebar-matrixSeriation').val(
                        'None').selectmenu("refresh");
                }
            });
            $( "#sidebar-similarity" ).selectmenu({
              select: function( event, ui ) 
              {   
                  visualization.similarityMatrices(ui.item.value, index);
              }
            });

             $('#layer3edge_focus').mousedown(function()
            {
                console.log(_focusNodeIndex);
                if (!$(this).is(':checked'))
                {
                    _chart[_focusNodeIndex].rerenderMultilayerPaths(_focusNodeIndex);
                    // _showLayer3Edge = true;
                    // rerenderMultilayerPaths();
                    // render_layer3(_shortlistedEdgeList_layer3);
                }
                else
                {
                     _chart[_focusNodeIndex].removeMultilayerPaths(_focusNodeIndex);
                    // _showLayer3Edge = false;
                    // // visualization.updateColorSpace('')
                    // removeMultilayerPaths();
                }
            });

             $( "#link-prediction" ).selectmenu({
              select: function( event, ui ) 
              {   
                  visualization.linkPrediction(ui.item.value, index);
              }
            });
            $("#sidebar-color").selectmenu(
            {
                select: function(event, ui)
                {
                    if (ui.item.value == "OG") visualization
                        .chartColoring("orange", "green",
                            index)
                    else if (ui.item.value == "BY")
                        visualization.chartColoring("black",
                            "yellow", index)
                    else if (ui.item.value == "PO")
                        visualization.chartColoring(
                            "purple", "orange", index)
                    else if (ui.item.value == "GR")
                        visualization.chartColoring("green",
                            "red", index)
                    else if (ui.item.value == "BR")
                        visualization.chartColoring("blue",
                            "red", index)
                    else if (ui.item.value == "RGB")
                        visualization.chartColoring("RGB",
                            "RGB", index)
                    else if (ui.item.value == "CBS1")
                        visualization.chartColoring(
                            "#f03b20", "#ffeda0", index)
                    else if (ui.item.value == "CBS2")
                        visualization.chartColoring(
                            "#7B3294", "#008837", index)
                    else if (ui.item.value == "CBS3")
                        visualization.chartColoring(
                            "#1f78b4", "#b2df8a", index)
                    else if (ui.item.value == "BW")
                        visualization.chartColoring("black",
                            "white", index)
                    else if (ui.item.value == "OW")
                        visualization.chartColoring(
                            "orange", "white", index)
                    else if (ui.item.value == "GW")
                        visualization.chartColoring("green",
                            "white", index)
                    else if (ui.item.value == "RW")
                        visualization.chartColoring("red",
                            "white", index)
                    else if (ui.item.value == "BlueW")
                        visualization.chartColoring("blue",
                            "white", index)
                    else if (ui.item.value == "HM")
                        visualization.chartColoring("HM",
                            "HM", index)
                    else visualization.chartColoring(
                        "black", "white", index)
                }
            });
            $("#sidebar-glyph").selectmenu(
            {
                change: function(event, ui)
                {
                    visualization.glyphType(ui.item.value)
                }
            });
            // console.log("Alpha value", _chart[index].getAlpha());
            $(function()
            {
                $("#sidebar-sliderCombination").slider(
                {
                    value: _chart[index].getAlpha(),
                    min: 0,
                    max: 1,
                    step: .05,
                    slide: function(event, ui)
                    {
                        $(
                            "#sidebar-sliderFilterMatrix"
                        ).slider("option",
                            "value", 1);
                        var value = $(
                            "#sidebar-sliderCombination"
                        ).slider("option",
                            "value");
                        $(
                            "#sidebar-sliderCombination"
                        ).find(
                            ".ui-slider-handle"
                        ).text(value);
                        alpha =  ui.value
                        // updateCombinedMatrix();
                        if( 'DissAdj' == $( "#matrix" ).val() )
                        {
                            visualization.updateData(dissAdjMatrix);  
                            $('#sidebar-matrixSeriation').val('None').selectmenu( "refresh" );                  
                        }          
                    },
                    change: function()
                    {
                        var value = $(
                            "#sidebar-sliderCombination"
                        ).slider("option",
                            "value");
                        $(
                            "#sidebar-sliderCombination"
                        ).find(
                            ".ui-slider-handle"
                        ).text(value);
                        visualization.updateCombinedMatrix(
                            value, index);
                    }
                });
            });
            $(function()
            {
                $("#sidebar-sliderFilterMatrix").slider(
                {
                    value: _chart[index].getBeta(),
                    min: 0,
                    max: 1,
                    step: .1,
                    slide: function(event, ui)
                    {
                        var value = $(
                            "#sidebar-sliderFilterMatrix"
                        ).slider("option",
                            "value");
                        $(
                            "#sidebar-sliderFilterMatrix"
                        ).find(
                            ".ui-slider-handle"
                        ).text(value);
                    },
                    change: function()
                    {
                        var value = $(
                            "#sidebar-sliderFilterMatrix"
                        ).slider("option",
                            "value");
                        $(
                            "#sidebar-sliderFilterMatrix"
                        ).find(
                            ".ui-slider-handle"
                        ).text(value);
                        visualization.updateValueFiltering(
                            value, index);
                    }
                });
            });
            $(document).ready(function()
            {



                $('.ui-slider-handle').width(40).height(15)
                var value = $("#sidebar-sliderCombination").slider(
                    "option", "value");
                // $("#sliderCombination").find(".ui-slider-handle").text('\u03B1 = ' + value);  
                $("#sidebar-sliderCombination").find(
                    ".ui-slider-handle").text(value);
                $("#sidebar-sliderFilterMatrix").slider(
                    "option", "value",1);
                var value = $("#sidebar-sliderFilterMatrix").slider(
                    "option", "value");
                // $("#sliderFilterMatrix").find(".ui-slider-handle").text('\u03B1 = ' + value);  
                $("#sidebar-sliderFilterMatrix").find(
                    ".ui-slider-handle").text(value);
                $('#sidebar-checkbox-1').change(function()
                {
                    $('#sidebar-textbox1').val($(this).is(
                        ':checked'));
                });
                $('#sidebar-checkbox-1').mousedown(function()
                {
                    if (!$(this).is(':checked'))
                    {
                        visualization.updateColorSpace(
                            'Lab')
                    }
                    else
                    {
                        visualization.updateColorSpace(
                            '')
                    }
                });
             
            });
            // $(function(){
            //     $( "#sidebar-clustering-button" )
            //   .button()
            //   .click(function( event ) {
            //     _chart[index].testingShape();
            //     event.preventDefault();
            //   });
            // });
            $("#sidebar-clustering-button").click(function(e)
            {
                e.preventDefault();
                var dimension = $("#spinner1").spinner("value");
                var clusters = $("#spinner2").spinner("value");
                visualization.applyClustering(dimension,
                    clusters, index);
                // testingShape(index);
                // $("#wrapper").toggleClass("toggled");
            });

            $("#sidebar-download").click(function(e)
            {
                e.preventDefault();
                var id = "matrix"+index;
                saveSvgAsPng(document.getElementById(id), "diagram.png");
                $("#"+id).clone().appendTo("#collectedview");

                var svgs = d3.selectAll("#collectedview svg")
                        .on("contextmenu", function(data, index)
                        {
                           d3.event.preventDefault(); 
                           this.remove();
                        });

                newid = 'c'+globalCount;
                globalCount +=1
                $("#collectedview #"+id).attr('id',newid);
                $("#collectedview #"+newid)
                  .draggable()
                  .bind('mousedown', function(event, ui){
                    // bring target to front
                    $(event.target.parentElement).append( event.target );
                  })
                  .bind('drag', function(event, ui){
                    // update coordinates manually, since top/left style props don't work on SVG
                    event.target.setAttribute('x', ui.position.left);
                    event.target.setAttribute('y', ui.position.top -1600);
                  });

                // saveAsPNG(id);
               
            });


        }
        else
        {
            var template = $('#rect-template').html();
            $('#test2').empty();
            $('#test2').append(originalSidebar);
            $('#test2').append(template);

            _chart[index].actionHistoryRefresh(); 
           // var historydiv = $('#historydiv').html();
            // $('#test2').append(historydiv);

            // var checkbox = $("#state")[0];
            // $("#test2").append(checkbox);
            window.freezeCheckboxID = "rect-state";


              $("#sidebar-download").click(function(e)
            {
                e.preventDefault();
                var id = "matrix"+index;
                saveSvgAsPng(document.getElementById(id), "diagram.png");

                $("#"+id).clone().appendTo("#collectedview");
                 var svgs = d3.selectAll("#collectedview svg")
                        .on("contextmenu", function(data, index)
                        {
                           d3.event.preventDefault(); 
                           this.remove();
                        });


                newid = 'c'+globalCount;
                globalCount +=1
                $("#collectedview #"+id).attr('id',newid);
                $("#collectedview #"+newid)
                  .draggable()
                  .bind('mousedown', function(event, ui){
                    // bring target to front
                    $(event.target.parentElement).append( event.target );
                  })
                  .bind('drag', function(event, ui){
                    // update coordinates manually, since top/left style props don't work on SVG
                    event.target.setAttribute('x', ui.position.left);
                    event.target.setAttribute('y', ui.position.top -1600);
                  });

                // saveAsPNG(id);
               
            });
            
            $("#rect-color").selectmenu();
            $("#rect-matrix").selectmenu();
            $("#rect-matrix").selectmenu(
            {
                select: function(event, ui)
                {
                    _matrix = ui.item.value;
                    if (ui.item.value == 'Self')
                    {
                        $('#chartArea1').empty();
                        visualization.restoreRectangularToSquareMatrix(
                            index);
                    }
                        
                     else if( ui.item.value == 'Graph' )
                     {
                        $('#chartArea1').empty();
                      visualization.drawClusteringGraph(index);  
                     }
                      
                    // else if( ui.item.value == 'Louven' )
                    //   visualization.applyCommunityDetectionLouven()  
                    // else if ( ui.item.value == 'None' )  
                    //   visualization.applyNoMatrixSeriation();
                }
            });
            $('#rect-state').mousedown(function()
            {
                if (!$(this).is(':checked'))
                {
                    _focusNodeToFreeze = true;
                    // visualization.updateColorSpace('Lab')
                }
                else
                {
                    _focusNodeToFreeze = false;
                    // visualization.updateColorSpace('')
                }
            });
            $("#rect-color").selectmenu(
            {
                select: function(event, ui)
                {
                    if (ui.item.value == "OG") visualization
                        .chartColoring("orange", "green",
                            index)
                    else if (ui.item.value == "BY")
                        visualization.chartColoring("black",
                            "yellow", index)
                    else if (ui.item.value == "PO")
                        visualization.chartColoring(
                            "purple", "orange", index)
                    else if (ui.item.value == "GR")
                        visualization.chartColoring("green",
                            "red", index)
                    else if (ui.item.value == "BR")
                        visualization.chartColoring("blue",
                            "red", index)
                    else if (ui.item.value == "RGB")
                        visualization.chartColoring("RGB",
                            "RGB", index)
                    else if (ui.item.value == "CBS1")
                        visualization.chartColoring(
                            "#f03b20", "#ffeda0", index)
                    else if (ui.item.value == "CBS2")
                        visualization.chartColoring(
                            "#7B3294", "#008837", index)
                    else if (ui.item.value == "CBS3")
                        visualization.chartColoring(
                            "#1f78b4", "#b2df8a", index)
                    else if (ui.item.value == "BW")
                        visualization.chartColoring("black",
                            "white", index)
                    else if (ui.item.value == "OW")
                        visualization.chartColoring(
                            "orange", "white", index)
                    else if (ui.item.value == "GW")
                        visualization.chartColoring("green",
                            "white", index)
                    else if (ui.item.value == "RW")
                        visualization.chartColoring("red",
                            "white", index)
                    else if (ui.item.value == "BlueW")
                        visualization.chartColoring("blue",
                            "white", index)
                    else if (ui.item.value == "HM")
                        visualization.chartColoring("HM",
                            "HM", index)
                    else visualization.chartColoring(
                        "black", "white", index)
                }
            });
            $('#rect-complement').mousedown(function()
            {
                if (!$(this).is(':checked'))
                {
                    console.log("complement pressed");
                    _chart[index].setComplementMatrix(true);
                    _chart[index].updateMatrixByComplement();
                    // _focusNodeToFreeze = true;
                    // visualization.updateColorSpace('Lab')
                }
                else
                {
                    _chart[index].setComplementMatrix(false);
                    _chart[index].restoreOriginalMatrix();
                    // _focusNodeToFreeze = false;
                    // visualization.updateColorSpace('')
                }
            });
        }
    }

    chart.drawClusteringGraph = function(index)
    {

        _chart[index].drawClusteringGraph();  
        return chart;
    }
    chart.restoreRectangularToSquareMatrix = function(index)
    {
        if (typeof index === 'undefined')
        {
            // for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
            // {
            //     d3.select("#matrix"+index+" > .parentGroup").remove();
            //     _chart[i].applyClustering(dimensions, clusters);
            // }
        }
        else
        {
            // console.log("aug, restore index:",index);
            d3.select("#matrix" + index + " .parentGroup").remove();
            _chart[index].restoreRectangularToSquareMatrix();
            return chart;
        }
    }

    chart.shortlistEdgesBetweenMatrices = function()
    {
        _shortlistedEdgeListByMatrices = new Array(_piecewiseDatasetMatrix.lenth);

        for(var i=0; i<_piecewiseDatasetMatrix.length;i++)
            _shortlistedEdgeListByMatrices[i] = [];

        for (var k = 0; k < _overAllEdgeList.length; ++k)
        {
            var id1 = _overAllEdgeList[k].src;
            var id2 = _overAllEdgeList[k].dst;
            var weight = _overAllEdgeList[k].cnt;
            for (i = 0; i < _piecewiseDatasetMatrix.length; ++i)
            {
                for (j = i; j < _piecewiseDatasetMatrix.length; ++j)
                {
                    // If paths are between two differnt matrics, draw them
                    if (i != j && _chart[i].hasID(id1) && _chart[j].hasID(
                        id2))
                    {
                        // drawPath(i, j, id1, id2)
                        _shortlistedEdgeList.push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight": weight
                        });
                        _shortlistedEdgeListByMatrices[i].push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight": weight
                        
                            });
                        _shortlistedEdgeListByMatrices[j].push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight": weight

                        
                            });

                    }
                    else if (i != j && _chart[i].hasID(id2) && _chart[j]
                        .hasID(id1))
                    {
                        // drawPath(i, j, id2, id1)
                        _shortlistedEdgeList.push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight": weight
                        });
                         _shortlistedEdgeListByMatrices[i].push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight": weight
                        
                            });
                        _shortlistedEdgeListByMatrices[j].push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight": weight
                        
                            });

                    }
                }
            }
        }
        // console.log("_overAllEdgeList: ",_overAllEdgeList, ", _shortlistedEdgeList: ",_shortlistedEdgeList, "_shortlistedEdgeListByMatrices",_shortlistedEdgeListByMatrices);
        console.log(" Total number of edges between marices: ",_shortlistedEdgeList.length);
        console.log("Total number of communities:", _piecewiseDatasetMatrix.length);

        // var countingedges=0;
        // for(var i=0;i<_shortlistedEdgeListByMatrices.length;i++)
        // {
        //     countingedges += _shortlistedEdgeListByMatrices[i].length;

        // }
        // console.log("total edges: ", countingedges);
    }      

    chart.shortlistEdgesBetweenMatricesMultilayer = function(_overAllEdgeList)
    {
        _layer3_Edges_ByMatrices = new Array(_piecewiseDatasetMatrix.lenth);
        _shortlistedEdgeList_layer3 = [];

        for(var i=0; i<_piecewiseDatasetMatrix.length;i++)
            _layer3_Edges_ByMatrices[i] = [];

        for (var k = 0; k < _overAllEdgeList.length; ++k)
        {
            var id1 = _overAllEdgeList[k].src;
            var id2 = _overAllEdgeList[k].dst;
            var weight =  _overAllEdgeList[k].cnt;
            for (i = 0; i < _piecewiseDatasetMatrix.length; ++i)
            {
                for (j = i; j < _piecewiseDatasetMatrix.length; ++j)
                {
                    // If paths are between two differnt matrics, draw them
                    if (i != j && _chart[i].hasID(id1) && _chart[j].hasID(
                        id2))
                    {
                        // drawPath(i, j, id1, id2)
                        _shortlistedEdgeList_layer3.push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight":weight
                        });
                        _layer3_Edges_ByMatrices[i].push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight":weight
                        
                            });
                        _layer3_Edges_ByMatrices[j].push({
                            "m1":i,
                            "m2":j,
                            "id1":id1,
                            "id2":id2,
                            "weight":weight
                        
                            });
                        // console.log("found. m1:",i," m2:",j," id1:",id1," id2:",id2);

                    }
                    else if (i != j && _chart[i].hasID(id2) && _chart[j]
                        .hasID(id1))
                    {
                        // drawPath(i, j, id2, id1)
                        _shortlistedEdgeList_layer3.push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight":weight
                        });
                         _layer3_Edges_ByMatrices[i].push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight":weight
                        
                            });
                        _layer3_Edges_ByMatrices[j].push({
                            "m1":i,
                            "m2":j,
                            "id1":id2,
                            "id2":id1,
                            "weight":weight
                        
                            });
                        // console.log("found. m1:",i," m2:",j," id1:",id1," id2:",id2);

                    }
                    else
                    {
                        // console.log("Not found. m1:",i," m2:",j," id1:",id1," id2:",id2);
                    }

                }
            }
        }
        console.log(" Total number of edges between marices - Layer3: ",_shortlistedEdgeList_layer3.length);    
        // console.log("_overAllEdgeList: ",_overAllEdgeList, ", _shortlistedEdgeList_layer3: ",_shortlistedEdgeList_layer3);

        // var countingedges=0;
        // for(var i=0;i<_layer3_Edges_ByMatrices.length;i++)
        // {
        //     countingedges += _layer3_Edges_ByMatrices[i].length;

        // }
        // console.log("total edges: ", countingedges);
    }           
    chart.leftSidebarClicked = function()
    {
        if (_showLayer3Edge1)
        {
            $("#layer3edge").attr("checked", "true");
        }
        $('#layer3edge').mousedown(function()
            {
                if (!$(this).is(':checked'))
                {
                    _showLayer3Edge1 = true;
                    // rerenderMultilayerPaths();
                    d3.selectAll('.layer3').attr("opacity",1);
                    // render_layer3(_shortlistedEdgeList_layer3);
                }
                else
                {
                    _showLayer3Edge1 = false;
                    d3.selectAll('.layer3').attr("opacity",0);
                    // visualization.updateColorSpace('')
                    // removeMultilayerPaths();
                    for(var i=0; i<_piecewiseDatasetMatrix.length; i++)
                    {   
                        if(_chart[i].getShowLayer3Edges())
                            _chart[i].rerenderMultilayerPaths(i);
                    }

                }
            });
    }

    chart.renderAugmentedNodetrix = function()
    {
        

        //Shivam - Done to set zoom level acording to amount of data beind displayed
        console.log("number of nodes=",_numberofNodes);
        if(_numberofNodes >50)
            AugmentedNodeTrix.globalScaleFactor = 150/ _numberofNodes;
        else
            AugmentedNodeTrix.globalScaleFactor=1;

        
      


        //TODO-Shivam - Calculate a rough center of the layout (Like a convex hull or bounding box and its width/2, height/2)
        var zoomWidth = (_width-AugmentedNodeTrix.globalScaleFactor*_width)/2 ;
        var zoomHeight = (_height-AugmentedNodeTrix.globalScaleFactor*_height)/2 ;
        // var zoomHeight = (_height-AugmentedNodeTrix.globalScaleFactor*_height)/2;



        // Remove existing chart elements 
        d3.select('#' + AugmentedNodeTrix._parentID).remove();
        var zoom = d3.behavior.zoom()
                            .translate([zoomWidth,zoomHeight])
                            .scale(AugmentedNodeTrix.globalScaleFactor)
                    // .scaleExtent([1, 10])
                            // .duration(10)
                            .on("zoomstart", zoomStart)
                            .on("zoom", zoomed)
                            .on("zoomend", zoomEnd);

        var node_drag = d3.behavior.drag()
                            .origin(function(d) { return d; })
                            .on("dragstart", dragstart)
                            .on("drag", dragmove)
                            // .duration(10)
                            .on("dragend", dragend);

        // Chart will be attached to the ID provided as input.
        var topParent = d3.select('#' + _chartContainerID).append('svg')
            .attr('id', AugmentedNodeTrix._parentID).attr('width',
                _width).attr('height', _height)
            .append("g")
            //Apended for zoom in and out --not working as intended  

            .call(zoom );
        // topParent.on("dblclick.zoom", null);

            //  .on("mousedown.zoom", null)
            // .on("touchstart.zoom", null)
            // .on("touchmove.zoom", null)
            // .on("touchend.zoom", null)

            

        topParent.append("rect")
            .attr("class", "overlay")
            .attr("width", _width)
            .attr("height", _height)
            .style("fill", "none")
            .style("pointer-events", "all");

            var container = topParent.append("g");
  // .append("g")
  //Till here for zoom

        // force = d3.layout.force().size([_width, _height]).gravity(0).friction(
        //     .5).distance(600).nodes(_piecewiseDatasetMatrix).on(
        //     "tick", tick)
        force = d3.layout.force()
            // .charge(-500)
            .size([_width / AugmentedNodeTrix.globalScaleFactor, _height /AugmentedNodeTrix.globalScaleFactor])
            .gravity(0.1)
            .friction(.5)

            // .distance(600)
            .nodes(_piecewiseDatasetMatrix)
             .linkDistance(_width/AugmentedNodeTrix.globalScaleFactor);

        // force.on("tick", function() {
        //     nodes[0].x = _width / 2;
        //     nodes[0].y = _height / 2;
        // });
            nodes = container.selectAll(".node").data(
            _piecewiseDatasetMatrix).enter().append("g").attr(
            "class", "node").call(node_drag);


        function zoomStart()
        {
            // console.log("at start of zoom");
            d3.selectAll(".bezierCurvesVisible").transition()
                            .duration(400)
                            .style("opacity","0");

            render.invalidate();
            render_layer3.invalidate();
        }
       
        function zoomed() {

            // console.log("inside zoomed");

            container.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
            AugmentedNodeTrix.globalScaleFactor = d3.event.scale.toFixed(1);  //to avoid long decimal calculations
            
           
          }
           function zoomEnd()
        {
            // console.log("at end of zoom");
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[i].reCalculateSize();
            tick();
            d3.selectAll(".bezierCurvesVisible").transition()
                            .duration(200)
                            .style("opacity","1");

        }

        // Individual matrices will be attached to these svg elements
        svgs = nodes.append("svg").attr('id', function(data, index)
        {
            return 'matrix' + index
        }).on("contextmenu", function(data, index)
        {
            //handle right click
            //stop showing browser menu
            d3.event.preventDefault();
            // console.log(this);
            // onSelectMatrix(index);
            // console.log($("#test2").attr("data-status"));
            // if ($("#test2").attr("data-status") != "opened")
            //  {
            //     $("#test2.container.sidebar.sidebar-right").find(
            //             ".toggler").trigger("click");
            //  }

            //Defocus any previous selected node
            if(tour.getCurrentStep() ==4)
            {
                // tour.next();
                tour.goTo(5);
            }
            visualization.deFocusNode();
            populateSidebar(index);

            visualization.focusNode(index);
            // console.log(index);
            // _chart[index].printMatrix();
            // console.log(_chart[index].dissimilarityMatrix, _chart[index].adjacencyMatrix);
        });
        // svgs.append(shadowFilter);
        for (var i = 0; i < _piecewiseDatasetMatrix.length; i++) _chart[i] = MatrixVisualization();
        topParent.selectAll(".node svg").data(_piecewiseDatasetMatrix.map(
            function(data)
            {
                return data.a
            })).each(function(data, index)
        {
            _chart[index](data, 'matrix' + index)
        });
        // Calulcate the links
        // var links = [];
        // for( var k = 0 ; k < _overAllEdgeList.length ; ++k )
        // {
        //         var id1 = _overAllEdgeList[k].src;
        //         var id2 = _overAllEdgeList[k].dst;
        //         for( i = 0 ; i < _piecewiseDatasetMatrix.length ; ++i )
        //         {
        //             for( j = i ; j < _piecewiseDatasetMatrix.length ; ++j)
        //             {
        //                 // console.log("id1=",id1,"id2=",id2,"i=",i,"j=",j);
        //                 // console.log(_chart[i].hasID(id1));
        //                 // console.log(_chart[j].hasID(id2));
        //                 // If paths are between two differnt matrices, draw them
        //                 if( i!=j && _chart[i].hasID(id1) && _chart[j].hasID(id2)  )
        //                 {
        //                     links.push({ 'source': id1, 'target' : id2, 'value': 10  });
        //                 }
        //                 else if( i!=j && _chart[i].hasID(id2) && _chart[j].hasID(id1) )
        //                 {
        //                     links.push({ 'source': id2, 'target' : id1, 'value': 50  });
        //                 }
        //             }
        //         }
        // } 
        // console.log(_chart[0]._rowLabels);
        // console.log(_chart[1]._rowLabels);
        // links.push({ 'source': 1, 'target' : 3, 'value': 10  });
        // links.push({ 'source': 2, 'target' : 7, 'value': 10  });
        // console.log(links);
        /*Disabled link based layout because layout was getting rearranged after change in the matrix type
        force.links(links).start(); 
        */
        // Start rendering the visualization  

        chart.shortlistEdgesBetweenMatrices();
        chart.shortlistEdgesBetweenMatricesMultilayer(_edgeList_layer3);

        force.start();
        nodes.attr("transform", function(d)
        {
            return "translate(" + (d.x )/ 1.3  + "," + (d.y )/ 2 +
                ")";
        });

        force.stop();

       
        var xpositionsofmatrices = [];
        var ypositionsofmatrices = [];
        for(var i=0; i<_piecewiseDatasetMatrix.length; i++)
        {
            xpositionsofmatrices.push($("#matrix"+i).offset()["left"]);
            ypositionsofmatrices.push($("#matrix"+i).offset()["top"]);

        }
        xpositionsofmatrices.sort(function(a, b) {
              return a - b;
            });
        ypositionsofmatrices.sort(function(a, b) {
              return a - b;
            });

        // console.log(xpositionsofmatrices, ypositionsofmatrices);
        var centerx = (xpositionsofmatrices[xpositionsofmatrices.length-1] - xpositionsofmatrices[0])/2  ;
        var centery = (ypositionsofmatrices[ypositionsofmatrices.length-1] - ypositionsofmatrices[0])/2  ;
        // console.log(centerx, centery);
        // container.attr("transform", "translate("+centerx+","+centery+")");
        //To redraw when starting at a different zoom level than 1
        // container.attr("transform", "translate("+centerx+","+centery+") scale("+AugmentedNodeTrix.globalScaleFactor+")");
        container.attr("transform", "translate("+zoomWidth+","+zoomHeight+") scale("+AugmentedNodeTrix.globalScaleFactor+")");
        for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[i].reCalculateSize();
        tick();

        return chart;
    }

    function dragstart(d, i)
    {
        // console.log(d,i);
        d3.event.sourceEvent.stopPropagation();
        // force.stop() // stops the force auto positioning before you start dragging
        // _tickFlag = false;
        // d3.selectAll('#' + AugmentedNodeTrix._parentID +
        //     ' .bezierCurves').remove();
        // tick();  
    }

    function dragmove(d, i)
    {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        // _tickFlag = true;
        // this is the key to make it work together with updating both px,py,x,y on d !
        // if(_tickFlag==true)
            // _tickTimer = setTimeout(function(){ _tickFlag = false; tick(); }, 100);
        tick1(i); 
        // rerenderMultilayerPaths(i);
    }

    function dragend(d, i)
    {
        // d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        // clearTimeout(_tickTimer);
        // _tickFlag = true;
        // _tickFlag = false;
        // force.resume();
        // tick();
    }
     function tick1(matrixId)
    {
        //
        // console.log("inside tick");
        nodes.attr("transform", function(d)
        {
            // return "translate(" + (d.x * globalScaleFactor)/ 1.3  + "," + (d.y * globalScaleFactor)/ 2 +
            //     ")";
            return "translate(" + (d.x )/ 1.3  + "," + (d.y )/ 2 +
                ")";
        });
        // Draw connecting paths whenever a tick happens
        // if(_tickFlag == false)
            reRenderPaths1(matrixId);
            // if(_showLayer3Edge)
            rerenderMultilayerPaths1(matrixId);
    }

    function tick()
    {

            reRenderPaths();
            // if(_showLayer3Edge)
            render_layer3(_shortlistedEdgeList_layer3);
            for(var i=0; i<_piecewiseDatasetMatrix.length; i++)
            {   
                if(_chart[i].getShowLayer3Edges())
                    _chart[i].rerenderMultilayerPaths(i);
            }
            // console.log("Inside tick()");

                // rerenderMultilayerPaths();
    }
   
    //For context operation fo showing or deleting layer3 edges
    function removeMultilayerPaths(matrixId)
    {
         // d3.selectAll('#' + AugmentedNodeTrix._parentID +
         //    ' .layer3').attr("opacity",0);
    }
    function rerenderMultilayerPaths1(matrixId)
    {
        d3.selectAll('#' + AugmentedNodeTrix._parentID +
           ' .mat'+matrixId + '.layer3').remove();
       //  // console.log(matrixId);

       // // render_layer3(_shortlistedEdgeList_layer3);
       //  // console.log(_overAllEdgeList)     ;
        for (var k = 0; k < _layer3_Edges_ByMatrices[matrixId].length; ++k)
        {
            drawPath_Multilayer(_layer3_Edges_ByMatrices[matrixId][k]["m1"], _layer3_Edges_ByMatrices[matrixId][k]["m2"], _layer3_Edges_ByMatrices[matrixId][k]["id1"], _layer3_Edges_ByMatrices[matrixId][k]["id2"], _layer3_Edges_ByMatrices[matrixId][k]["weight"] );
        }

        if(_chart[matrixId].getShowLayer3Edges() || _showLayer3Edge1)
            _chart[matrixId].rerenderMultilayerPaths(matrixId);
        
    }

    //Shivam - moved to matrixvisualization1.js as it will be a focus related task
    // function removeMultilayerPaths(matrixId)
    // {
    //      d3.selectAll('#' + AugmentedNodeTrix._parentID +
    //         ' .layer3').attr("opacity",0);
    // }
    // function rerenderMultilayerPaths1(matrixId)
    // {
    //     d3.selectAll('#' + AugmentedNodeTrix._parentID +
    //        ' .mat'+matrixId + '.layer3').attr("opacity",1);
    //     // console.log(matrixId);

    //    // render_layer3(_shortlistedEdgeList_layer3);
    //     // console.log(_overAllEdgeList)     ;
    //     // for (var k = 0; k < _layer3_Edges_ByMatrices[matrixId].length; ++k)
    //     // {
    //     //     drawPath_Multilayer(_layer3_Edges_ByMatrices[matrixId][k]["m1"], _layer3_Edges_ByMatrices[matrixId][k]["m2"], _layer3_Edges_ByMatrices[matrixId][k]["id1"], _layer3_Edges_ByMatrices[matrixId][k]["id2"]);
    //     // }
    // }

    function rerenderMultilayerPaths()
    {
        // d3.selectAll('#' + AugmentedNodeTrix._parentID +
        //     ' .layer3').remove();
        // console.log(matrixId);

       render_layer3(_shortlistedEdgeList_layer3);
        // console.log(_overAllEdgeList)     ;
    }
    // function rerenderMultilayerPaths(matrixId)
    // {
    //     d3.selectAll('#' + AugmentedNodeTrix._parentID +
    //         ' .layer3').remove();
    //     // console.log(matrixId);

    //     for (var k = 0; k < _layer3_Edges_ByMatrices[matrixId].length; ++k)
    //     {
    //         drawPath_Multilayer(_layer3_Edges_ByMatrices[matrixId][k]["m1"], _layer3_Edges_ByMatrices[matrixId][k]["m2"], _layer3_Edges_ByMatrices[matrixId][k]["id1"], _layer3_Edges_ByMatrices[matrixId][k]["id2"]);
    //     }
    //     // console.log(_overAllEdgeList)     ;
    // }

    function reRenderPaths1(matrixId)
    {
        d3.selectAll('#' + AugmentedNodeTrix._parentID +
            ' .mat'+matrixId).remove();
        // console.log(matrixId);

        for (var k = 0; k < _shortlistedEdgeListByMatrices[matrixId].length; ++k)
        {
            drawPath(_shortlistedEdgeListByMatrices[matrixId][k]["m1"], _shortlistedEdgeListByMatrices[matrixId][k]["m2"], _shortlistedEdgeListByMatrices[matrixId][k]["id1"], _shortlistedEdgeListByMatrices[matrixId][k]["id2"], _shortlistedEdgeListByMatrices[matrixId][k]["weight"] );
        }
        // console.log(_overAllEdgeList)     ;
    }

    function reRenderPaths()
    {
     
        
        render(_shortlistedEdgeList);

        //Commenting this because zoom was working very slow
        // render_layer3(_shortlistedEdgeList_layer3);

        for(var i=0; i<_piecewiseDatasetMatrix.length; i++)
        {   
            if(_chart[i].getShowLayer3Edges())
                _chart[i].rerenderMultilayerPaths(i);
        }
                      

        // console.log(_overAllEdgeList)     ;
    }
    // function generateData()
    // {
    //     return _shortlistedEdgeList;
    // }

    function drawPath2(datapoint)
    {
        var matrixNumber1 = datapoint["m1"];
        var matrixNumber2 = datapoint["m2"];
        var id1 = datapoint["id1"];
        var  id2 = datapoint["id2"];
        var weight = datapoint["weight"];

        //   nodes.attr("transform", function(d)
        // {
        //     // return "translate(" + (d.x * globalScaleFactor)/ 1.3  + "," + (d.y * globalScaleFactor)/ 2 +
        //     //     ")";
        //     return "translate(" + (d.x )/ 1.3  + "," + (d.y )/ 2 +
        //         ")";
        // });

        // console.log("id1",id1, "id2",id2); 
        var cellPosition1, cellPosition2;
        // console.log("d3 scale= ", myd3.event.scale);
        var controlPointPadd = 100 * AugmentedNodeTrix.globalScaleFactor;
        // var path = d3.select('#' + AugmentedNodeTrix._parentID + ' g g').append(
        //     'path');
         var path = d3.select('#' + AugmentedNodeTrix._parentID ).append(
            'path');
          path.attr("stroke-width", (weight+AugmentedNodeTrix.edgeWeightBaseWidth)*AugmentedNodeTrix.globalScaleFactor);
           // path.attr("sourceAuthorId", id1);
           //  path.attr("destinationAuthorId", id2);
           // path.attr('class','src'+id1+ ' dest'+id2);
        var drawable = false;
        /*@ToDo - Have some rule which makes sure that nearby matrices have straight lines instead of curves
    if( 
        Math.abs(_chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() - _chart[ matrixNumber2 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  - _chart[ matrixNumber2 ].topLeft().xPos ) < 150 ||

        Math.abs(_chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() - _chart[ matrixNumber1 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width()  - _chart[ matrixNumber1 ].topLeft().xPos ) < 150
    )
controlPointPadd = 10;*/

        // M1 - M2 ( Top - Bottom )
        if (_chart[matrixNumber1].topLeft().yPos + _chart[matrixNumber1]
            .height() < _chart[matrixNumber2].topLeft().yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'bottom');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'top');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2 +' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos +
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos - controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Left - Right )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() < _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber1].topLeft().yPos + _chart[
                matrixNumber1].height() > _chart[matrixNumber2].topLeft()
            .yPos && _chart[matrixNumber1].isSquareMAtrix() && _chart[
                matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'right');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'left');
           path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2 +' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos + controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos -
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Bottom - Top )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() > _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber2].topLeft().yPos + _chart[
                matrixNumber2].height() < _chart[matrixNumber1].topLeft()
            .yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Right - Left )
        else if (_chart[matrixNumber1].isSquareMAtrix() && _chart[
            matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'left');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'right');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos - controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos +
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        else
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2 +' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        controlPointPadd = 175;
        // controlPointPadd = 10;
 
        if (drawable)
        {
            if (AugmentedNodeTrix._currentHighlightedPair.src == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.src == id2 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id2)
            {
                path.classed('bezierCurvesHighlighted', true);
                path.classed('bezierCurvesDeHighlighted', false);

            }
            else if (AugmentedNodeTrix._currentHighlightedPair.src != -
                1 && AugmentedNodeTrix._currentHighlightedPair.dst != -
                1)
            {
                // console.log(AugmentedNodeTrix._currentHighlightedPair.src, ", ", AugmentedNodeTrix._currentHighlightedPair.dst);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', true);
            }
            else
            {
                path.classed('bezierCurves', true);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', false);
            }
        }


    }
    function drawPath_Multilayer2(datapoint)
    {
        var matrixNumber1 = datapoint["m1"];
        var matrixNumber2 = datapoint["m2"];
        var id1 = datapoint["id1"];
        var  id2 = datapoint["id2"];
        var weight = datapoint["weight"];

        //   nodes.attr("transform", function(d)
        // {
        //     // return "translate(" + (d.x * globalScaleFactor)/ 1.3  + "," + (d.y * globalScaleFactor)/ 2 +
        //     //     ")";
        //     return "translate(" + (d.x )/ 1.3  + "," + (d.y )/ 2 +
        //         ")";
        // });

        // console.log("id1",id1, "id2",id2); 
        var cellPosition1, cellPosition2;
        // console.log("d3 scale= ", myd3.event.scale);
        var controlPointPadd = 100 * AugmentedNodeTrix.globalScaleFactor;
        // var path = d3.select('#' + AugmentedNodeTrix._parentID + ' g g').append(
        //     'path');
         var path = d3.select('#' + AugmentedNodeTrix._parentID ).append(
            'path');
         path.attr("opacity",0);
         path.attr("stroke-width", (weight+AugmentedNodeTrix.edgeWeightBaseWidth)*AugmentedNodeTrix.globalScaleFactor);

        var drawable = false;
        /*@ToDo - Have some rule which makes sure that nearby matrices have straight lines instead of curves
    if( 
        Math.abs(_chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() - _chart[ matrixNumber2 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  - _chart[ matrixNumber2 ].topLeft().xPos ) < 150 ||

        Math.abs(_chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() - _chart[ matrixNumber1 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width()  - _chart[ matrixNumber1 ].topLeft().xPos ) < 150
    )
controlPointPadd = 10;*/

        // M1 - M2 ( Top - Bottom )
        if (_chart[matrixNumber1].topLeft().yPos + _chart[matrixNumber1]
            .height() < _chart[matrixNumber2].topLeft().yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'bottom');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'top');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3' +' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos +
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos - controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Left - Right )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() < _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber1].topLeft().yPos + _chart[
                matrixNumber1].height() > _chart[matrixNumber2].topLeft()
            .yPos && _chart[matrixNumber1].isSquareMAtrix() && _chart[
                matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'right');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'left');
           path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos + controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos -
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Bottom - Top )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() > _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber2].topLeft().yPos + _chart[
                matrixNumber2].height() < _chart[matrixNumber1].topLeft()
            .yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Right - Left )
        else if (_chart[matrixNumber1].isSquareMAtrix() && _chart[
            matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'left');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'right');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos - controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos +
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        else
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2+ ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        controlPointPadd = 175;
        // controlPointPadd = 10;
 
        if (drawable)
        {
            if (AugmentedNodeTrix._currentHighlightedPair.src == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.src == id2 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id2)
            {
                path.classed('bezierCurvesHighlighted', true);
                path.classed('bezierCurvesDeHighlighted', false);

            }
            else if (AugmentedNodeTrix._currentHighlightedPair.src != -
                1 && AugmentedNodeTrix._currentHighlightedPair.dst != -
                1)
            {
                // console.log(AugmentedNodeTrix._currentHighlightedPair.src, ", ", AugmentedNodeTrix._currentHighlightedPair.dst);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', true);
            }
            else
            {
                path.classed('bezierCurves', true);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', false);
            }
        }
    }
     function drawPath_Multilayer(matrixNumber1, matrixNumber2, id1, id2, weight)
    {

        var cellPosition1, cellPosition2;
        // console.log("d3 scale= ", myd3.event.scale);
        var controlPointPadd = 100 * AugmentedNodeTrix.globalScaleFactor;
        // var path = d3.select('#' + AugmentedNodeTrix._parentID + ' g g').append(
        //     'path');
         var path = d3.select('#' + AugmentedNodeTrix._parentID ).append(
            'path');
         path.attr("opacity",0);
         path.attr("stroke-width", (weight+AugmentedNodeTrix.edgeWeightBaseWidth)*AugmentedNodeTrix.globalScaleFactor);
        var drawable = false;
        /*@ToDo - Have some rule which makes sure that nearby matrices have straight lines instead of curves
    if( 
        Math.abs(_chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() - _chart[ matrixNumber2 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  - _chart[ matrixNumber2 ].topLeft().xPos ) < 150 ||

        Math.abs(_chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() - _chart[ matrixNumber1 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width()  - _chart[ matrixNumber1 ].topLeft().xPos ) < 150
    )
controlPointPadd = 10;*/

        // M1 - M2 ( Top - Bottom )
        if (_chart[matrixNumber1].topLeft().yPos + _chart[matrixNumber1]
            .height() < _chart[matrixNumber2].topLeft().yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'bottom');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'top');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos +
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos - controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Left - Right )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() < _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber1].topLeft().yPos + _chart[
                matrixNumber1].height() > _chart[matrixNumber2].topLeft()
            .yPos && _chart[matrixNumber1].isSquareMAtrix() && _chart[
                matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'right');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'left');
           path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos + controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos -
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Bottom - Top )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() > _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber2].topLeft().yPos + _chart[
                matrixNumber2].height() < _chart[matrixNumber1].topLeft()
            .yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Right - Left )
        else if (_chart[matrixNumber1].isSquareMAtrix() && _chart[
            matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'left');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'right');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2 + ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos - controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos +
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        else
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesInvisible mat'+matrixNumber1 +' mat'+matrixNumber2+ ' layer3'+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        controlPointPadd = 175;
        // controlPointPadd = 10;
 
        if (drawable)
        {
            if (AugmentedNodeTrix._currentHighlightedPair.src == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.src == id2 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id2)
            {
                path.classed('bezierCurvesHighlighted', true);
                path.classed('bezierCurvesDeHighlighted', false);

            }
            else if (AugmentedNodeTrix._currentHighlightedPair.src != -
                1 && AugmentedNodeTrix._currentHighlightedPair.dst != -
                1)
            {
                // console.log(AugmentedNodeTrix._currentHighlightedPair.src, ", ", AugmentedNodeTrix._currentHighlightedPair.dst);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', true);
            }
            else
            {
                path.classed('bezierCurves', true);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', false);
            }
        }
    }
    function drawPath(matrixNumber1, matrixNumber2, id1, id2, weight)
    {

        var cellPosition1, cellPosition2;
        // console.log("d3 scale= ", myd3.event.scale);
        var controlPointPadd = 100 * AugmentedNodeTrix.globalScaleFactor;
        // var path = d3.select('#' + AugmentedNodeTrix._parentID + ' g g').append(
        //     'path');
         var path = d3.select('#' + AugmentedNodeTrix._parentID ).append(
            'path');
            path.attr("stroke-width", (weight+AugmentedNodeTrix.edgeWeightBaseWidth)*AugmentedNodeTrix.globalScaleFactor);
            // path.attr("sourceAuthorId", id1);
            // path.attr("destinationAuthorId", id2);
        var drawable = false;
        /*@ToDo - Have some rule which makes sure that nearby matrices have straight lines instead of curves
    if( 
        Math.abs(_chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() - _chart[ matrixNumber2 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  - _chart[ matrixNumber2 ].topLeft().xPos ) < 150 ||

        Math.abs(_chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() - _chart[ matrixNumber1 ].topLeft().yPos ) < 150 ||
        Math.abs(_chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width()  - _chart[ matrixNumber1 ].topLeft().xPos ) < 150
    )
controlPointPadd = 10;*/

        // M1 - M2 ( Top - Bottom )
        if (_chart[matrixNumber1].topLeft().yPos + _chart[matrixNumber1]
            .height() < _chart[matrixNumber2].topLeft().yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'bottom');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'top');

            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos +
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos - controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Left - Right )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() < _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber1].topLeft().yPos + _chart[
                matrixNumber1].height() > _chart[matrixNumber2].topLeft()
            .yPos && _chart[matrixNumber1].isSquareMAtrix() && _chart[
                matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'right');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'left');
           path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos + controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos -
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Bottom - Top )
        else if (_chart[matrixNumber1].topLeft().xPos + _chart[
                matrixNumber1].width() > _chart[matrixNumber2].topLeft()
            .xPos && _chart[matrixNumber2].topLeft().yPos + _chart[
                matrixNumber2].height() < _chart[matrixNumber1].topLeft()
            .yPos)
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        // M1 - M2 ( Right - Left )
        else if (_chart[matrixNumber1].isSquareMAtrix() && _chart[
            matrixNumber2].isSquareMAtrix())
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'left');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'right');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + (cellPosition1.xPos - controlPointPadd) +
                ' ' + cellPosition1.yPos + ', ' + (cellPosition2.xPos +
                    controlPointPadd) + ' ' + cellPosition2.yPos +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        else
        {
            cellPosition1 = _chart[matrixNumber1].connectingPosition(
                id1, 'top');
            cellPosition2 = _chart[matrixNumber2].connectingPosition(
                id2, 'bottom');
            path.attr('class', 'bezierCurves bezierCurvesVisible mat'+matrixNumber1 +' mat'+matrixNumber2+' n'+id1+ ' n'+id2).attr('d', 'M ' +
                cellPosition1.xPos + ' ' + cellPosition1.yPos +
                ' C ' + cellPosition1.xPos + ' ' + (cellPosition1.yPos -
                    controlPointPadd) + ', ' + cellPosition2.xPos +
                ' ' + (cellPosition2.yPos + controlPointPadd) +
                ',  ' + cellPosition2.xPos + ' ' + cellPosition2.yPos
            )
            drawable = true;
        }
        controlPointPadd = 175;
        // controlPointPadd = 10;
        /* Working ALgorithm

        // M1 - M2 ( Top - Bottom )

    //console.log(matrixNumber1 + " " + matrixNumber2 + " " + id1 + " " + id2)
    //console.log(  _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() );
    //console.log(  _chart[ matrixNumber2 ].topLeft().yPos );

    if(          
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() < _chart[ matrixNumber2 ].topLeft().yPos
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'bottom');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'top');   

            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos+controlPointPadd) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos-controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )

               drawable = true;

               //console.log('Case1 Top Bottom')
    }

    // M1 - M2 ( Left - Right )
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  < _chart[ matrixNumber2 ].topLeft().xPos &&
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() >  _chart[ matrixNumber2 ].topLeft().yPos
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'right');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'left');   


                path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + (cellPosition1.xPos+controlPointPadd) + ' ' + cellPosition1.yPos 
                               + ', ' + (cellPosition2.xPos-controlPointPadd) + ' ' + cellPosition2.yPos + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )

               drawable = true;

                               //console.log('Case1 Left RIght') 
    }

    // M1 - M2 ( Bottom - Top )
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  > _chart[ matrixNumber2 ].topLeft().xPos &&
          _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() <  _chart[ matrixNumber1 ].topLeft().yPos
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'top');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'bottom');    
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos-controlPointPadd) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos+controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos ) 

               drawable = true;

               //console.log('Case1 Bottom Top') 
    }

    // M1 - M2 ( Right - Left )
    else
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'left');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'right'); 

                path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + (cellPosition1.xPos-controlPointPadd) + ' ' + cellPosition1.yPos 
                               + ', ' + (cellPosition2.xPos+controlPointPadd) + ' ' + cellPosition2.yPos + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )   

               drawable = true;

                               //console.log('Case1 Right Left')  
    }

    */
        /* Algorithm with some improvements. Require Testing.
    // Case 1
    if(          
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() < _chart[ matrixNumber2 ].topLeft().yPos &&
          _chart[ matrixNumber1 ].topLeft().xPos < _chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width() &&
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width() > _chart[ matrixNumber2 ].topLeft().xPos 
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'bottom');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'top');   

            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos+controlPointPadd) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos-controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )

               drawable = true;
    }

    // Case 2
    else if(    

          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() < _chart[ matrixNumber2 ].topLeft().yPos &&         
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width() < _chart[ matrixNumber2 ].topLeft().xPos &&
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width() < _chart[ matrixNumber2 ].topLeft().xPos
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'right');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'top');   

            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + (cellPosition1.xPos+controlPointPadd) + ' ' + (cellPosition1.yPos) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos-controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )

               drawable = true;
    }

    // Case 3
    else if(          
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() < _chart[ matrixNumber2 ].topLeft().yPos          
          && _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width() > _chart[ matrixNumber2 ].topLeft().xPos 
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'left');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'top');  
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + (cellPosition1.xPos-controlPointPadd) + ' ' + (cellPosition1.yPos) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos-controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos )

               drawable = true;
    }

    // Case 7
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  < _chart[ matrixNumber2 ].topLeft().xPos &&
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() <  _chart[ matrixNumber2 ].topLeft().yPos &&
          _chart[ matrixNumber1 ].topLeft().yPos >  _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height()
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'right');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'left');

            path.attr('class', 'bezierCurves')
            .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                            + (cellPosition1.xPos+controlPointPadd) + ' ' + cellPosition1.yPos 
                            + ', ' + (cellPosition2.xPos-controlPointPadd) + ' ' + cellPosition2.yPos + ',  '
                            + cellPosition2.xPos + ' ' + cellPosition2.yPos )

            drawable = true;
    }

    // Case 5
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().yPos >  _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() &&
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width()  < _chart[ matrixNumber2 ].topLeft().xPos                    
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'top');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'left');    
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos-controlPointPadd) 
                               + ', ' + (cellPosition2.xPos-controlPointPadd) + ' ' + (cellPosition2.yPos) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos ) 

               drawable = true;
    }

    // Case 4
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().yPos >  _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() &&
          _chart[ matrixNumber1 ].topLeft().xPos >  _chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width() &&
          _chart[ matrixNumber1 ].topLeft().xPos + _chart[ matrixNumber1 ].width() <  _chart[ matrixNumber2 ].topLeft().xPos
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'top');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'bottom');    
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos-controlPointPadd) 
                               + ', ' + cellPosition2.xPos + ' ' + (cellPosition2.yPos+controlPointPadd) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos ) 

               drawable = true;
    }

    // Case 6
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().yPos >  _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() &&
          _chart[ matrixNumber1 ].topLeft().xPos >  _chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width()          
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'top');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'right');    
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + cellPosition1.xPos + ' ' + (cellPosition1.yPos-controlPointPadd) 
                               + ', ' + (cellPosition2.xPos+controlPointPadd) + ' ' + (cellPosition2.yPos) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos ) 

               drawable = true;
    }

    // Case 8
    else if(  
          
          _chart[ matrixNumber1 ].topLeft().xPos >  _chart[ matrixNumber2 ].topLeft().xPos + _chart[ matrixNumber2 ].width() &&
          _chart[ matrixNumber1 ].topLeft().yPos >  _chart[ matrixNumber2 ].topLeft().yPos + _chart[ matrixNumber2 ].height() &&
          _chart[ matrixNumber1 ].topLeft().yPos + _chart[ matrixNumber1 ].height() > _chart[ matrixNumber2 ].topLeft().yPos 
      )
    {
            cellPosition1 = _chart[ matrixNumber1 ].connectingPosition(id1,'left');
            cellPosition2 = _chart[ matrixNumber2 ].connectingPosition(id2,'right');    
            
               path.attr('class', 'bezierCurves')
               .attr('d', 'M ' + cellPosition1.xPos + ' ' + cellPosition1.yPos + ' C '
                               + (cellPosition1.xPos-controlPointPadd) + ' ' + (cellPosition1.yPos) 
                               + ', ' + (cellPosition2.xPos+controlPointPadd) + ' ' + (cellPosition2.yPos) + ',  '
                               + cellPosition2.xPos + ' ' + cellPosition2.yPos ) 

               drawable = true;
    }

    else
    {
        console.log('None..');
    }
    */
        if (drawable)
        {
            if (AugmentedNodeTrix._currentHighlightedPair.src == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.src == id2 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id1 ||
                AugmentedNodeTrix._currentHighlightedPair.dst == id2)
            {
                path.classed('bezierCurvesHighlighted', true);
                path.classed('bezierCurvesDeHighlighted', false);

            }
            else if (AugmentedNodeTrix._currentHighlightedPair.src != -
                1 && AugmentedNodeTrix._currentHighlightedPair.dst != -
                1)
            {
                // console.log(AugmentedNodeTrix._currentHighlightedPair.src, ", ", AugmentedNodeTrix._currentHighlightedPair.dst);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', true);
            }
            else
            {
                path.classed('bezierCurves', true);
                path.classed('bezierCurvesHighlighted', false);
                path.classed('bezierCurvesDeHighlighted', false);
            }
        }
    }
    chart.restoreOriginalMatrix = function(index)
    {
        console.log("restoring original matrix");
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].restoreOriginalMatrix();
        }
        else
        {
            // console.log("here");
            _chart[index].restoreOriginalMatrix();
            // _chart[index].applyLaplacian(); 
            // Push the operation in history variable
        }
        return chart;
    }
    chart.updateCombinedMatrix = function(alpha, index)
    {
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
            {
                // if(i==0){
                //   console.log("BEfore");
                // _chart[0].printMatrix();    
                // }
                _chart[i].updateCombinedMatrix(alpha);
                // if(i==0)
                //  {  
                //     console.log("after");
                //     _chart[0].printMatrix();
                //  }
            }
        }
        else
        {
            _chart[index].updateCombinedMatrix(alpha);
        }
    }
    chart.applyLaplacian = function(index)
    {
        if (typeof index === 'undefined')
        {
            console.log("applying lap");
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].applyLaplacian();
        }
        else
        {
            _chart[index].applyLaplacian();
            // Push the operation in history variable
        }
        return chart;
    }
    chart.applyVAT = function(index)
    {
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].applyVAT();
        }
        else
        {
            _chart[index].applyVAT();
            // _chart[index]._history.push("VAT Seriation");
            // console.log(_chart[index]._history);
        }
        return chart;
    }
     chart.applyLeaf = function(index)
    {
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].applyLeaf();
        }
        else
        {
            _chart[index].applyLeaf();
            // _chart[index]._history.push("VAT Seriation");
            // console.log(_chart[index]._history);
        }
        return chart;
    }
     chart.applyCrossingReduction = function(index)
    {
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].applyCrossingReduction();
        }
        else
        {
            _chart[index].applyCrossingReduction();
            // _chart[index]._history.push("VAT Seriation");
            // console.log(_chart[index]._history);
        }
        return chart;
    }
    chart.applyBandwidthReduction = function(index)
    {
        if (typeof index === 'undefined')
        {
            for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                if (_chart[i].getState() != "freezed") _chart[i].applyBandwidthReduction();
        }
        else
        {
            _chart[index].applyBandwidthReduction();
            // _chart[index]._history.push("VAT Seriation");
            // console.log(_chart[index]._history);
        }
        return chart;
    }

     chart.applyCLUSION = function(index)
    {
        if (typeof index === 'undefined')
        {
            // for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                // if (_chart[i].getState() != "freezed") _chart[i].applyCLUSION();
        }
        else
        {
            _chart[index].applyCLUSION();
            // _chart[index]._history.push("VAT Seriation");
            // console.log(_chart[index]._history);
        }
        return chart;
    }
    chart.applyCommunityDetectionLouven = function()
    {
        AugmentedNodeTrix._communityDetection = true;
        for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[
            i].applyCommunityDetectionLeuven();
        AugmentedNodeTrix._communityDetection = false;
        return chart;
    }
    chart.applyElyptical = function()
    {
        for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[
            i].applyElyptical();
        return chart;
    }
    chart.applyNoMatrixSeriation = function()
    {
        for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i) _chart[
            i].revertOriginalMatrixState();
        return chart;
    }
    chart.chartColoring = function(color1, color2, index)
        {
            if (arguments.length < 2)
            {
                return {
                    start: AugmentedNodeTrix._colorScaleStart,
                    end: AugmentedNodeTrix._colorScaleEnd
                };
            }
            if (typeof index == "undefined")
            {
                AugmentedNodeTrix._colorScaleStart = color1;
                AugmentedNodeTrix._colorScaleEnd = color2;
                for (var i = 0; i < _piecewiseDatasetMatrix.length; ++i)
                {
                    if (_chart[i].getState() != "freezed") _chart[i].updateColorScale(
                        color1, color2)
                }
            }
            else
            {
                AugmentedNodeTrix._colorScaleStart = color1;
                AugmentedNodeTrix._colorScaleEnd = color2;
                // for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
                _chart[index].updateColorScale(color1, color2)
            }
            return chart;
        }
        // chart.chartColoringIndividual = function(color1, color2,index)
        // {
        //     if( arguments.length < 2 )
        //     {
        //         return { start: AugmentedNodeTrix._colorScaleStart , end : AugmentedNodeTrix._colorScaleEnd };
        //     }
        //     AugmentedNodeTrix._colorScaleStart = color1;
        //     AugmentedNodeTrix._colorScaleEnd   = color2;
        //     // for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
        //       _chart[index].updateColorScale(color1,color2)    
        //     return chart;
        // }

    chart.linkPrediction = function(operation, index)
    {
        if (typeof index === 'undefined')
        {

        }
        else
        {
            _chart[index].linkPrediction(operation);
        }
    }

    chart.similarityMatrices = function(similarityType, index)
    {
        if (typeof index === 'undefined')
        {

        }
        else
        {
            _chart[index].similarityMatrices(similarityType);
        }
    }
    chart.glyphType = function(type)
    {
        AugmentedNodeTrix.glyphType = type;
        if (0 != _chart.length)
        {
            // var topParent = d3.select('#' + _chartContainerID)
            //                  .selectAll(".node svg")
            //                  .data(_piecewiseDatasetMatrix.map(function(data){return data.a}))
            //                  .each( function(data,index) { _chart[index].updateData(data) } );   
            chart.renderAugmentedNodetrix();
        }
        return chart;
    }
    return chart;
}