

function AugmentedNodeTrix(chartContainerID)
{
    var _chart                  = [];
    var _width                  = 500;
    var _height                 = 500;
    var _datasetMatrix          = [];
    var _piecewiseDatasetMatrix = [];
    var _clusteringList ;
    
    // var _overAllEdgeList = [{src:74,dst:13,cnt: 9},{src:74,dst:147,cnt: 7},{src:13,dst:147,cnt: 8},{src:110,dst:81,cnt: 2},{src:3,dst:79,cnt: 1},{src:3,dst:86,cnt: 1},{src:3,dst:131,cnt: 1},{src:79,dst:86,cnt: 1},{src:79,dst:131,cnt: 1},{src:86,dst:131,cnt: 1},{src:109,dst:110,cnt: 1},{src:109,dst:81,cnt: 4},{src:68,dst:142,cnt: 1},{src:68,dst:81,cnt: 1},{src:142,dst:81,cnt: 1},{src:80,dst:137,cnt: 1},{src:41,dst:58,cnt: 1},{src:41,dst:129,cnt: 1},{src:41,dst:74,cnt: 1},{src:58,dst:129,cnt: 1},{src:58,dst:74,cnt: 3},{src:129,dst:74,cnt: 1},{src:81,dst:88,cnt: 1},{src:2,dst:73,cnt: 2},{src:2,dst:45,cnt: 1},{src:2,dst:91,cnt: 1},{src:45,dst:91,cnt: 1},{src:2,dst:14,cnt: 1},{src:2,dst:16,cnt: 1},{src:14,dst:16,cnt: 2},{src:14,dst:73,cnt: 3},{src:16,dst:73,cnt: 4},{src:63,dst:74,cnt: 3},{src:10,dst:146,cnt: 1},{src:83,dst:81,cnt: 1},{src:17,dst:63,cnt: 2},{src:3,dst:82,cnt: 3},{src:67,dst:13,cnt: 1},{src:67,dst:147,cnt: 1},{src:6,dst:32,cnt: 1},{src:6,dst:42,cnt: 1},{src:6,dst:56,cnt: 1},{src:6,dst:63,cnt: 1},{src:6,dst:147,cnt: 1},{src:6,dst:74,cnt: 1},{src:6,dst:13,cnt: 1},{src:32,dst:42,cnt: 1},{src:32,dst:56,cnt: 1},{src:32,dst:63,cnt: 1},{src:32,dst:147,cnt: 1},{src:32,dst:74,cnt: 1},{src:32,dst:13,cnt: 1},{src:42,dst:56,cnt: 1},{src:42,dst:63,cnt: 1},{src:42,dst:147,cnt: 1},{src:42,dst:74,cnt: 1},{src:42,dst:13,cnt: 1},{src:56,dst:63,cnt: 1},{src:56,dst:147,cnt: 1},{src:56,dst:74,cnt: 1},{src:56,dst:13,cnt: 1},{src:63,dst:147,cnt: 1},{src:63,dst:13,cnt: 1},{src:14,dst:46,cnt: 1},{src:16,dst:46,cnt: 1},{src:46,dst:73,cnt: 2},{src:55,dst:77,cnt: 1},{src:109,dst:144,cnt: 1},{src:82,dst:146,cnt: 1},{src:17,dst:58,cnt: 1},{src:58,dst:63,cnt: 3},{src:89,dst:74,cnt: 1},{src:89,dst:147,cnt: 1},{src:5,dst:58,cnt: 3},{src:5,dst:63,cnt: 1},{src:54,dst:58,cnt: 1},{src:54,dst:108,cnt: 1},{src:54,dst:42,cnt: 1},{src:58,dst:108,cnt: 1},{src:58,dst:42,cnt: 1},{src:108,dst:42,cnt: 1},{src:48,dst:70,cnt: 1},{src:48,dst:92,cnt: 1},{src:48,dst:102,cnt: 1},{src:48,dst:81,cnt: 1},{src:70,dst:92,cnt: 1},{src:70,dst:102,cnt: 1},{src:70,dst:81,cnt: 1},{src:92,dst:102,cnt: 1},{src:92,dst:81,cnt: 1},{src:102,dst:81,cnt: 3},{src:91,dst:133,cnt: 1},{src:15,dst:18,cnt: 2},{src:15,dst:60,cnt: 2},{src:15,dst:143,cnt: 2},{src:15,dst:145,cnt: 2},{src:15,dst:139,cnt: 2},{src:18,dst:60,cnt: 3},{src:18,dst:143,cnt: 2},{src:18,dst:145,cnt: 2},{src:18,dst:139,cnt: 5},{src:60,dst:143,cnt: 2},{src:60,dst:145,cnt: 2},{src:60,dst:139,cnt: 3},{src:143,dst:145,cnt: 2},{src:143,dst:139,cnt: 2},{src:145,dst:139,cnt: 2},{src:66,dst:141,cnt: 3},{src:66,dst:81,cnt: 2},{src:141,dst:81,cnt: 2},{src:42,dst:103,cnt: 1},{src:8,dst:12,cnt: 1},{src:8,dst:27,cnt: 1},{src:8,dst:134,cnt: 1},{src:8,dst:82,cnt: 1},{src:12,dst:27,cnt: 1},{src:12,dst:134,cnt: 1},{src:12,dst:82,cnt: 1},{src:27,dst:134,cnt: 1},{src:27,dst:82,cnt: 1},{src:134,dst:82,cnt: 1},{src:16,dst:39,cnt: 1},{src:39,dst:73,cnt: 2},{src:1,dst:11,cnt: 1},{src:1,dst:19,cnt: 1},{src:1,dst:28,cnt: 1},{src:1,dst:49,cnt: 1},{src:1,dst:59,cnt: 1},{src:1,dst:101,cnt: 1},{src:1,dst:111,cnt: 1},{src:11,dst:19,cnt: 2},{src:11,dst:28,cnt: 3},{src:11,dst:49,cnt: 3},{src:11,dst:59,cnt: 1},{src:11,dst:101,cnt: 1},{src:11,dst:111,cnt: 1},{src:19,dst:28,cnt: 2},{src:19,dst:49,cnt: 2},{src:19,dst:59,cnt: 1},{src:19,dst:101,cnt: 1},{src:19,dst:111,cnt: 1},{src:28,dst:49,cnt: 4},{src:28,dst:59,cnt: 1},{src:28,dst:101,cnt: 1},{src:28,dst:111,cnt: 1},{src:49,dst:59,cnt: 1},{src:49,dst:101,cnt: 1},{src:49,dst:111,cnt: 1},{src:59,dst:101,cnt: 1},{src:59,dst:111,cnt: 1},{src:101,dst:111,cnt: 1},{src:46,dst:71,cnt: 1},{src:71,dst:73,cnt: 1},{src:52,dst:72,cnt: 1},{src:52,dst:74,cnt: 1},{src:72,dst:74,cnt: 1},{src:5,dst:13,cnt: 1},{src:5,dst:64,cnt: 1},{src:5,dst:139,cnt: 2},{src:5,dst:74,cnt: 1},{src:13,dst:58,cnt: 1},{src:13,dst:64,cnt: 1},{src:13,dst:139,cnt: 1},{src:58,dst:64,cnt: 1},{src:58,dst:139,cnt: 2},{src:64,dst:139,cnt: 1},{src:64,dst:74,cnt: 1},{src:139,dst:74,cnt: 2},{src:11,dst:40,cnt: 1},{src:11,dst:47,cnt: 1},{src:11,dst:51,cnt: 1},{src:11,dst:84,cnt: 1},{src:11,dst:105,cnt: 1},{src:28,dst:40,cnt: 1},{src:28,dst:47,cnt: 1},{src:28,dst:51,cnt: 1},{src:28,dst:84,cnt: 1},{src:28,dst:105,cnt: 2},{src:40,dst:47,cnt: 1},{src:40,dst:49,cnt: 1},{src:40,dst:51,cnt: 1},{src:40,dst:84,cnt: 1},{src:40,dst:105,cnt: 1},{src:47,dst:49,cnt: 1},{src:47,dst:51,cnt: 1},{src:47,dst:84,cnt: 1},{src:47,dst:105,cnt: 1},{src:49,dst:51,cnt: 1},{src:49,dst:84,cnt: 1},{src:49,dst:105,cnt: 1},{src:51,dst:84,cnt: 1},{src:51,dst:105,cnt: 1},{src:84,dst:105,cnt: 1},{src:3,dst:21,cnt: 1},{src:3,dst:33,cnt: 1},{src:3,dst:69,cnt: 1},{src:21,dst:33,cnt: 1},{src:21,dst:69,cnt: 1},{src:21,dst:82,cnt: 1},{src:33,dst:69,cnt: 1},{src:33,dst:82,cnt: 1},{src:69,dst:82,cnt: 1},{src:75,dst:146,cnt: 1},{src:90,dst:146,cnt: 1},{src:29,dst:37,cnt: 1},{src:29,dst:44,cnt: 1},{src:29,dst:128,cnt: 1},{src:29,dst:135,cnt: 1},{src:29,dst:147,cnt: 1},{src:37,dst:44,cnt: 1},{src:37,dst:128,cnt: 1},{src:37,dst:135,cnt: 1},{src:37,dst:147,cnt: 1},{src:44,dst:128,cnt: 1},{src:44,dst:135,cnt: 1},{src:44,dst:147,cnt: 1},{src:128,dst:135,cnt: 1},{src:128,dst:147,cnt: 1},{src:135,dst:147,cnt: 1},{src:72,dst:148,cnt: 1},{src:81,dst:74,cnt: 1},{src:81,dst:13,cnt: 1},{src:9,dst:102,cnt: 2},{src:25,dst:28,cnt: 1},{src:25,dst:50,cnt: 1},{src:28,dst:50,cnt: 1},{src:104,dst:81,cnt: 1},{src:20,dst:31,cnt: 1},{src:20,dst:82,cnt: 1},{src:31,dst:82,cnt: 1},{src:65,dst:85,cnt: 1},{src:7,dst:4,cnt: 1},{src:43,dst:82,cnt: 1},{src:43,dst:81,cnt: 2},{src:82,dst:81,cnt: 1},{src:0,dst:36,cnt: 1},{src:0,dst:113,cnt: 1},{src:0,dst:81,cnt: 1},{src:36,dst:113,cnt: 1},{src:36,dst:81,cnt: 1},{src:113,dst:81,cnt: 1},{src:26,dst:65,cnt: 1},{src:26,dst:72,cnt: 1},{src:65,dst:72,cnt: 1},{src:16,dst:57,cnt: 1},{src:57,dst:73,cnt: 1},{src:18,dst:22,cnt: 2},{src:22,dst:60,cnt: 1},{src:22,dst:139,cnt: 2},{src:72,dst:78,cnt: 1},{src:102,dst:132,cnt: 1},{src:132,dst:81,cnt: 1},{src:52,dst:87,cnt: 1},{src:52,dst:106,cnt: 1},{src:52,dst:107,cnt: 1},{src:87,dst:106,cnt: 1},{src:87,dst:107,cnt: 1},{src:106,dst:107,cnt: 1},{src:30,dst:102,cnt: 1},{src:30,dst:81,cnt: 1},{src:61,dst:76,cnt: 1},{src:61,dst:80,cnt: 1},{src:61,dst:13,cnt: 1},{src:76,dst:80,cnt: 1},{src:76,dst:13,cnt: 1},{src:80,dst:13,cnt: 1},{src:118,dst:119,cnt: 1},{src:118,dst:126,cnt: 2},{src:118,dst:46,cnt: 1},{src:119,dst:126,cnt: 1},{src:119,dst:46,cnt: 1},{src:126,dst:46,cnt: 2},{src:127,dst:138,cnt: 1},{src:24,dst:99,cnt: 1},{src:24,dst:100,cnt: 1},{src:24,dst:77,cnt: 1},{src:99,dst:100,cnt: 1},{src:99,dst:77,cnt: 1},{src:100,dst:77,cnt: 1},{src:53,dst:95,cnt: 1},{src:53,dst:114,cnt: 1},{src:53,dst:115,cnt: 1},{src:53,dst:116,cnt: 1},{src:53,dst:123,cnt: 1},{src:53,dst:125,cnt: 1},{src:53,dst:126,cnt: 1},{src:95,dst:114,cnt: 1},{src:95,dst:115,cnt: 1},{src:95,dst:116,cnt: 1},{src:95,dst:123,cnt: 1},{src:95,dst:125,cnt: 1},{src:95,dst:126,cnt: 1},{src:114,dst:115,cnt: 1},{src:114,dst:116,cnt: 1},{src:114,dst:123,cnt: 1},{src:114,dst:125,cnt: 1},{src:114,dst:126,cnt: 1},{src:115,dst:116,cnt: 1},{src:115,dst:123,cnt: 1},{src:115,dst:125,cnt: 1},{src:115,dst:126,cnt: 1},{src:116,dst:123,cnt: 1},{src:116,dst:125,cnt: 1},{src:116,dst:126,cnt: 1},{src:123,dst:125,cnt: 1},{src:123,dst:126,cnt: 1},{src:125,dst:126,cnt: 1},{src:124,dst:139,cnt: 1},{src:124,dst:22,cnt: 1},{src:124,dst:18,cnt: 1},{src:34,dst:118,cnt: 1},{src:34,dst:126,cnt: 1},{src:46,dst:72,cnt: 1},{src:140,dst:127,cnt: 1},{src:38,dst:82,cnt: 1},{src:77,dst:117,cnt: 1},{src:77,dst:147,cnt: 1},{src:117,dst:147,cnt: 1},{src:35,dst:39,cnt: 1},{src:35,dst:73,cnt: 1},{src:35,dst:120,cnt: 1},{src:39,dst:120,cnt: 1},{src:73,dst:120,cnt: 1},{src:57,dst:98,cnt: 1},{src:57,dst:121,cnt: 1},{src:98,dst:121,cnt: 1},{src:62,dst:94,cnt: 1},{src:62,dst:130,cnt: 1},{src:62,dst:42,cnt: 1},{src:94,dst:130,cnt: 1},{src:94,dst:42,cnt: 1},{src:130,dst:42,cnt: 1},{src:96,dst:104,cnt: 2},{src:96,dst:112,cnt: 1},{src:104,dst:112,cnt: 1},{src:96,dst:97,cnt: 1},{src:97,dst:104,cnt: 1},{src:72,dst:127,cnt: 1},{src:82,dst:102,cnt: 1},{src:82,dst:122,cnt: 1},{src:102,dst:122,cnt: 1},{src:105,dst:13,cnt: 1},{src:4,dst:28,cnt: 1},{src:4,dst:49,cnt: 1},{src:93,dst:81,cnt: 1},{src:93,dst:136,cnt: 1},{src:23,dst:72,cnt: 1}]
        var _overAllEdgeList = [];
    // Original data set ordering
    //var _overAllLabelsList                    = [{name: "Callahan",id: 0},{name: "Su",id: 1},{name: "Goldstein",id: 2},{name: "Hollan",id: 3},{name: "Landay",id: 4},{name: "Pitkow",id: 5},{name: "Pedersen",id: 6},{name: "Hong",id: 7},{name: "Stewart",id: 8},{name: "Fekete",id: 9},{name: "Zacks",id: 10},{name: "Aiken",id: 11},{name: "Hollan",id: 12},{name: "Mackinlay",id: 13},{name: "Mattis",id: 14},{name: "Carlis",id: 15},{name: "Kolojejchick",id: 16},{name: "Lamping",id: 17},{name: "Riedl",id: 18},{name: "Chen",id: 19},{name: "Meyer",id: 20},{name: "Helfman",id: 21},{name: "Konstan",id: 22},{name: "Steffen",id: 23},{name: "Claffy",id: 24},{name: "Kuchinsky",id: 25},{name: "Wilks",id: 26},{name: "Druin",id: 27},{name: "Woodruff",id: 28},{name: "Larson",id: 29},{name: "Doan",id: 30},{name: "Good",id: 31},{name: "Masinter",id: 32},{name: "Ring",id: 33},{name: "Derthick",id: 34},{name: "Moore",id: 35},{name: "Weiser",id: 36},{name: "Dantzich",id: 37},{name: "Boltman",id: 38},{name: "Derthick",id: 39},{name: "Lin",id: 40},{name: "Stefik",id: 41},{name: "Hearst",id: 42},{name: "Wattenberg",id: 43},{name: "Czerwinski",id: 44},{name: "Goldberg",id: 45},{name: "Chuah",id: 46},{name: "Chu",id: 47},{name: "Rose",id: 48},{name: "Stonebraker",id: 49},{name: "Baldonado",id: 50},{name: "Spalding",id: 51},{name: "Gershon",id: 52},{name: "Lucas",id: 53},{name: "Schank",id: 54},{name: "Burchard",id: 55},{name: "Halvorsen",id: 56},{name: "Lucas",id: 57},{name: "Pirolli",id: 58},{name: "Wisnovsky",id: 59},{name: "Barry",id: 60},{name: "Zellweger",id: 61},{name: "Dhamija",id: 62},{name: "Rao",id: 63},{name: "Gossweiler",id: 64},{name: "Becker",id: 65},{name: "Beigel",id: 66},{name: "DeLine",id: 67},{name: "Botafogo",id: 68},{name: "Hightower",id: 69},{name: "Widoff",id: 70},{name: "Kerpedjiev",id: 71},{name: "Eick",id: 72},{name: "Roth",id: 73},{name: "Card",id: 74},{name: "Jul",id: 75},{name: "Igarashi",id: 76},{name: "Munzner",id: 77},{name: "Ball",id: 78},{name: "McCandless",id: 79},{name: "Chang",id: 80},{name: "Shneiderman",id: 81},{name: "Bederson",id: 82},{name: "Jain",id: 83},{name: "Ercegovac",id: 84},{name: "Cleveland",id: 85},{name: "Hill",id: 86},{name: "Ruh",id: 87},{name: "Weiland",id: 88},{name: "York",id: 89},{name: "Zhang",id: 90},{name: "Myers",id: 91},{name: "Milash",id: 92},{name: "Johnson",id: 93},{name: "Yee",id: 94},{name: "Senn",id: 95},{name: "Conklin",id: 96},{name: "Prabhakar",id: 97},{name: "Higgins",id: 98},{name: "Fenner",id: 99},{name: "Hoffman",id: 100},{name: "Paxson",id: 101},{name: "Plaisant",id: 102},{name: "Karadi",id: 103},{name: "North",id: 104},{name: "Olston",id: 105},{name: "Winstead",id: 106},{name: "Levasseur",id: 107},{name: "Diehl",id: 108},{name: "Ahlberg",id: 109},{name: "Williamson",id: 110},{name: "Taylor",id: 111},{name: "Saini",id: 112},{name: "Hopkins",id: 113},{name: "Kolojechick",id: 114},{name: "Dunmire",id: 115},{name: "Gomberg",id: 116},{name: "Guimbretiere",id: 117},{name: "Kolojejchick",id: 118},{name: "Mattis",id: 119},{name: "Harrison",id: 120},{name: "Senn",id: 121},{name: "Grosjean",id: 122},{name: "Burks",id: 123},{name: "Barry",id: 124},{name: "Stroffolino",id: 125},{name: "Roth",id: 126},{name: "Keahey",id: 127},{name: "Robbins",id: 128},{name: "Russell",id: 129},{name: "Fisher",id: 130},{name: "Wroblewski",id: 131},{name: "Carr",id: 132},{name: "Kosbie",id: 133},{name: "Proft",id: 134},{name: "Thiel",id: 135},{name: "Turo",id: 136},{name: "Ungar",id: 137},{name: "Robertson",id: 138},{name: "Chi",id: 139},{name: "Robertson",id: 140},{name: "Tanin",id: 141},{name: "Rivlin",id: 142},{name: "Shoop",id: 143},{name: "Wistrand",id: 144},{name: "Retzel",id: 145},{name: "Furnas",id: 146},{name: "Robertson",id: 147},{name: "Wills",id: 148}]

    // Ordering of names based on pre clustered dataset
    var _overAllLabelsList                    = [ {name: "Roth",id: 126},{name: "Lucas",id: 53},{name: "Burks",id: 123},{name: "Stroffolino",id: 125},{name: "Kolojechick",id: 114},{name: "Senn",id: 95},{name: "Dunmire",id: 115},{name: "Gomberg",id: 116},{name: "Kolojejchick",id: 118},{name: "Mattis",id: 119},{name: "Derthick",id: 34},{name: "Kerpedjiev",id: 71},{name: "Lucas",id: 57},{name: "Goldstein",id: 2},{name: "Chuah",id: 46},{name: "Mattis",id: 14},{name: "Roth",id: 73},{name: "Kolojejchick",id: 16},{name: "Derthick",id: 39},{name: "Moore",id: 35},{name: "Harrison",id: 120},{name: "Senn",id: 121},{name: "Higgins",id: 98},{name: "Goldberg",id: 45},{name: "Myers",id: 91},{name: "Kosbie",id: 133},{name: "Eick",id: 72},{name: "Becker",id: 65},{name: "Wilks",id: 26},{name: "Ball",id: 78},{name: "Steffen",id: 23},{name: "Keahey",id: 127},{name: "Wills",id: 148},{name: "Cleveland",id: 85},{name: "Robertson",id: 140},{name: "Robertson",id: 138},{name: "Winstead",id: 106},{name: "Ruh",id: 87},{name: "Levasseur",id: 107},{name: "Gershon",id: 52},{name: "Bederson",id: 82},{name: "Hollan",id: 3},{name: "Hightower",id: 69},{name: "Helfman",id: 21},{name: "Ring",id: 33},{name: "Druin",id: 27},{name: "Proft",id: 134},{name: "Stewart",id: 8},{name: "Hollan",id: 12},{name: "Grosjean",id: 122},{name: "Wroblewski",id: 131},{name: "McCandless",id: 79},{name: "Hill",id: 86},{name: "Furnas",id: 146},{name: "Zhang",id: 90},{name: "Zacks",id: 10},{name: "Jul",id: 75},{name: "Good",id: 31},{name: "Meyer",id: 20},{name: "Boltman",id: 38},{name: "Wattenberg",id: 43},{name: "Plaisant",id: 102},{name: "Milash",id: 92},{name: "Widoff",id: 70},{name: "Rose",id: 48},{name: "Carr",id: 132},{name: "Doan",id: 30},{name: "Fekete",id: 9},{name: "Shneiderman",id: 81},{name: "Hopkins",id: 113},{name: "Weiser",id: 36},{name: "Callahan",id: 0},{name: "Beigel",id: 66},{name: "Tanin",id: 141},{name: "Weiland",id: 88},{name: "Williamson",id: 110},{name: "Rivlin",id: 142},{name: "Botafogo",id: 68},{name: "Jain",id: 83},{name: "Ahlberg",id: 109},{name: "Wistrand",id: 144},{name: "Johnson",id: 93},{name: "Turo",id: 136},{name: "North",id: 104},{name: "Saini",id: 112},{name: "Conklin",id: 96},{name: "Prabhakar",id: 97},{name: "Paxson",id: 101},{name: "Wisnovsky",id: 59},{name: "Chen",id: 19},{name: "Taylor",id: 111},{name: "Su",id: 1},{name: "Stonebraker",id: 49},{name: "Woodruff",id: 28},{name: "Aiken",id: 11},{name: "Chu",id: 47},{name: "Spalding",id: 51},{name: "Lin",id: 40},{name: "Ercegovac",id: 84},{name: "Olston",id: 105},{name: "Landay",id: 4},{name: "Hong",id: 7},{name: "Baldonado",id: 50},{name: "Kuchinsky",id: 25},{name: "Carlis",id: 15},{name: "Barry",id: 60},{name: "Retzel",id: 145},{name: "Riedl",id: 18},{name: "Shoop",id: 143},{name: "Konstan",id: 22},{name: "Barry",id: 124},{name: "Chi",id: 139},{name: "Gossweiler",id: 64},{name: "Pitkow",id: 5},{name: "Pirolli",id: 58},{name: "Card",id: 74},{name: "Hearst",id: 42},{name: "Rao",id: 63},{name: "Pedersen",id: 6},{name: "Halvorsen",id: 56},{name: "Masinter",id: 32},{name: "Mackinlay",id: 13},{name: "Robertson",id: 147},{name: "Robbins",id: 128},{name: "Dantzich",id: 37},{name: "Thiel",id: 135},{name: "Czerwinski",id: 44},{name: "Larson",id: 29},{name: "Stefik",id: 41},{name: "Russell",id: 129},{name: "Lamping",id: 17},{name: "Diehl",id: 108},{name: "Schank",id: 54},{name: "Dhamija",id: 62},{name: "Yee",id: 94},{name: "Fisher",id: 130},{name: "York",id: 89},{name: "Karadi",id: 103},{name: "Igarashi",id: 76},{name: "Zellweger",id: 61},{name: "Chang",id: 80},{name: "Ungar",id: 137},{name: "DeLine",id: 67},{name: "Burchard",id: 55},{name: "Fenner",id: 99},{name: "Hoffman",id: 100},{name: "Claffy",id: 24},{name: "Munzner",id: 77},{name: "Guimbretiere",id: 117} ];    

    // var _overAllLabelsList                    = d3.range(40);

    // var _overAllLabelsList                      = [{name: "1",id: 1},{name: "2",id: 2},{name: "3",id: 3},{name: "4",id: 4},{name: "5",id: 5},{name: "6",id: 6},{name: "7",id: 7},{name: "8",id: 8},{name: "9",id: 9},{name: "10",id: 10},{name: "11",id: 11},{name: "12",id: 12},{name: "13",id: 13},{name: "14",id: 14},{name: "15",id: 15},{name: "16",id: 16},{name: "17",id: 17},{name: "18",id: 18},{name: "19",id: 19},{name: "20",id: 1} ]

    var _chartContainerID                     = chartContainerID;
    var node;
    
    AugmentedNodeTrix._currentHighlightedPair = { src: -1 , dst: -1 };
    AugmentedNodeTrix._parentID               = 'topParent';
    AugmentedNodeTrix._glyphType              = 'rect';
    AugmentedNodeTrix._colorScaleStart        = 'black';
    AugmentedNodeTrix._colorScaleEnd          = 'white';
    AugmentedNodeTrix._communityDetection     = false;
    AugmentedNodeTrix._alpha                  = 1.0;
    AugmentedNodeTrix._LABColorSpace          = false;

function chart()
{  
    return this;  
}

chart.width = function(width)
{
    if(undefined!=width)
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
    if(undefined!=height)
    {
        _height = height;
        return chart;
    }

    else
    {
        return _height;
    }
}

chart.loadClusteringInfo = function(clusteringList)
{
    _clusteringList = clusteringList;
    return chart;
}

chart.loadMatrix = function(dataSet)
{
     _piecewiseDatasetMatrix.length = 0;
     _datasetMatrix = dataSet;   


      var arrayInitialPos = 0;      

      // Generate individual matrices out of combined one and fill in the piecewise dataset matrix.
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
  
      //       for (var i = 0; i < window.row; i++)   
      //           for (var j = 0; j < window.column; j++)   
      //               matrix[i][j] =  _datasetMatrix[i+arrayInitialPos][j+arrayInitialPos];

      //       var data = { matrixData: matrix , labelsData: labelsList };

      //       _piecewiseDatasetMatrix.push({a:data});
      //       arrayInitialPos = _clusteringList[k];
      // }

       // Shivam - code to run only for a single matrix
            matrix = _datasetMatrix;
            var data = { matrixData: window.dataMatrix ,rowSize: window.row, columnSize: window.column, labelsData: _overAllLabelsList };

            _piecewiseDatasetMatrix.push({a:data});

            var data = { matrixData: window.d_row ,rowSize:window.row,columnSize:window.row,  labelsData: _overAllLabelsList };

            _piecewiseDatasetMatrix.push({a:data});

              var data = { matrixData: window.d_column ,rowSize:window.column,columnSize:window.column, labelsData: _overAllLabelsList };

            _piecewiseDatasetMatrix.push({a:data});

            console.log(_piecewiseDatasetMatrix);

        return chart;
}

chart.rectVAT = function()
{
    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )

      _chart[i].rectVAT();
}

chart.updateValueFiltering = function(alpha)
{
    AugmentedNodeTrix._alpha = alpha;
    
    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
      _chart[i].renderUpdatedMatrix();
}

chart.updateData = function(data)
{
    _datasetMatrix = data;
    this.loadMatrix(data);

    var topParent = d3.select('#' + _chartContainerID)
                        .selectAll(".node svg")
                        .data(_piecewiseDatasetMatrix.map(function(data){return data.a}))
                        .each( function(data,index) { _chart[index].updateData(data) } );
    return chart;
}

chart.updateColorSpace = function(colorSpace)
{
    if( 'Lab' == colorSpace )
    {
        AugmentedNodeTrix._LABColorSpace = true;
    }

    else
    {
        AugmentedNodeTrix._LABColorSpace = false;
    }

    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
      _chart[i].updateColorScale(AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd)    
}

chart.renderAugmentedNodetrix = function()
{
    // Remove existing chart elements 
    d3.select('#'+AugmentedNodeTrix._parentID).remove();

    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

        // Chart will be attached to the ID provided as input.
        var topParent = d3.select('#' + _chartContainerID).append('svg')
                                                .attr('id',AugmentedNodeTrix._parentID)
                                                .attr('width', _width)
                                                .attr('height', _height)                                                                                                
        
        force = d3.layout.force()
                      .size([_width,_height])
                      .gravity(0)          
                      .friction(.5)
                      .distance(300)
                      .nodes(_piecewiseDatasetMatrix)
                      .on("tick", tick)
                      
        nodes = topParent.selectAll(".node")
                          .data(_piecewiseDatasetMatrix)
                          .enter().append("g")
                          .attr("class", "node")
                          .call(node_drag);


        // Individual matrices will be attached to these svg elements
        svgs = nodes.append("svg")      
              .attr('id', function(data,index) { return 'matrix'+ index });

        for (var i = 0; i < _piecewiseDatasetMatrix.length; i++) 
            _chart[i] = MatrixVisualization(); 
        
        topParent.selectAll(".node svg")
                .data(_piecewiseDatasetMatrix.map(function(data){return data.a}))
                .each( function(data,index) { _chart[index]( data , 'matrix'+index ) } ); 


        // Calulcate the links
        var links = [];
        // for( var k = 0 ; k < _overAllEdgeList.length ; ++k )
        // {
        //         var id1 = _overAllEdgeList[k].src;
        //         var id2 = _overAllEdgeList[k].dst;

        //         for( i = 0 ; i < _piecewiseDatasetMatrix.length ; ++i )
        //         {
        //             for( j = i ; j < _piecewiseDatasetMatrix.length ; ++j)
        //             {
        //                 // If paths are between two differnt matrices, draw them
        //                 if( i!=j && _chart[i].hasID(id1) && _chart[j].hasID(id2)  )
        //                 {
        //                     links.push({ 'source': i, 'target' : j, 'value': 10  });
        //                 }

        //                 else if( i!=j && _chart[i].hasID(id2) && _chart[j].hasID(id1) )
        //                 {
        //                     links.push({ 'source': i, 'target' : j, 'value': 50  });
        //                 }
        //             }
        //         }
        // } 

        // Disabled link based layout because layout was getting rearranged after change in the matrix type
        // force.links(links).start(); 
        

        // Start rendering the visualization    
        force.start(); 

    return chart;
}

function dragstart(d, i) 
{
        force.stop() // stops the force auto positioning before you start dragging
}

function dragmove(d, i) 
{
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x  += d3.event.dx;
        d.y  += d3.event.dy; 
        tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) 
{
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        tick();
        force.resume();
}

function tick() 
{ 
    nodes.attr("transform", function(d) { return "translate(" + d.x / 1.3 + "," + d.y / 2 + ")"; }); 

    // Draw connecting paths whenever a tick happens
    reRenderPaths()
}

function reRenderPaths()
{    
      d3.selectAll( '#' + AugmentedNodeTrix._parentID + ' .bezierCurves').remove();

          for( var k = 0 ; k < _overAllEdgeList.length ; ++k )
          {
                var id1 = _overAllEdgeList[k].src;
                var id2 = _overAllEdgeList[k].dst;

                for( i = 0 ; i < _piecewiseDatasetMatrix.length ; ++i )
                {
                    for( j = i ; j < _piecewiseDatasetMatrix.length ; ++j)
                    {
                        // If paths are between two differnt matrics, draw them
                        if( i!=j && _chart[i].hasID(id1) && _chart[j].hasID(id2)  )
                        {
                            drawPath(i,j,id1,id2)       
                        }

                        else if( i!=j && _chart[i].hasID(id2) && _chart[j].hasID(id1) )
                        {
                            drawPath(i,j,id2,id1)       
                        }
                    }
                }
          }      
}

function drawPath(matrixNumber1,matrixNumber2,id1,id2)
{
    var cellPosition1, cellPosition2 ;
    var controlPointPadd = 100 ;
    var path = d3.select('#' + AugmentedNodeTrix._parentID).append('path');

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

    }

    controlPointPadd = 175;

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


    if( drawable )
    {
          if( AugmentedNodeTrix._currentHighlightedPair.src == id1 || AugmentedNodeTrix._currentHighlightedPair.src == id2 || AugmentedNodeTrix._currentHighlightedPair.dst == id1 || AugmentedNodeTrix._currentHighlightedPair.dst == id2 )
          {
              path.classed('bezierCurvesHighlighted',true);
          }

          else if( AugmentedNodeTrix._currentHighlightedPair.src != -1 && AugmentedNodeTrix._currentHighlightedPair.dst != -1 )
          {
              path.classed('bezierCurvesDeHighlighted',true);
          }

          else
          {
              path.classed('bezierCurves',true);
          }        
    }    
}

chart.applyVAT = function()
{

    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
       _chart[i].applyVAT(); 

    return chart;
}

chart.applyCommunityDetectionLouven = function()
{
    AugmentedNodeTrix._communityDetection = true;

    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
       _chart[i].applyCommunityDetectionLeuven();  

       AugmentedNodeTrix._communityDetection = false;

    return chart;   
}

chart.applyElyptical = function()
{
    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
      _chart[i].applyElyptical();     

    return chart;
}

chart.applyNoMatrixSeriation = function()
{
    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )  
      _chart[i].revertOriginalMatrixState();

    return chart;
}

chart.chartColoring = function(color1, color2)
{
    if( arguments.length < 2 )
    {
        return { start: AugmentedNodeTrix._colorScaleStart , end : AugmentedNodeTrix._colorScaleEnd };
    }

    AugmentedNodeTrix._colorScaleStart = color1;
    AugmentedNodeTrix._colorScaleEnd   = color2;

    for( var i = 0 ; i < _piecewiseDatasetMatrix.length;  ++i )
      _chart[i].updateColorScale(color1,color2)    

    return chart;
}

chart.glyphType = function(type)
{
    AugmentedNodeTrix.glyphType = type;   

    if( 0!= _chart.length)
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