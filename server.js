var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
var fs = require("fs");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
// var MongoClient = require('mongodb').MongoClient, format = require('util').format;
// var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	// db = databaseConnection;
// });


var rawjson = {
  "recipe": {
    "title": "Wild Mushroom and Butter Bean Pasta",
    "chef": "David Tanis",
    "desc": "This is a great pasta for autumn, hearty and deeply flavorful. Wild golden chanterelle mushrooms are especially nice and often available in the fall; choose small, firm, unblemished ones. Otherwise use a mixture of pale oyster mushrooms, including royal trumpets. End-of-summer fresh shelling beans work well here, or any dried white bean, such as cannellini. The simple complementary flavors of olive oil, pancetta, garlic and rosemary are just right, mingling with lightly browned mushrooms and creamy beans. Make sure to keep the pasta firmly al dente. To get the best rosemary flavor, chop it at the last moment, and toss a rosemary sprig into the pot while the pasta is cooking.",
    "img": "https://static01.nyt.com/images/2016/10/05/dining/05KITCH-WEB1/05KITCH-WEB1-articleLarge.jpg",
    "url": "http://cooking.nytimes.com/recipes/1018331-wild-mushroom-and-butter-bean-pasta?action=click&module=Latest+Recipes+Recipe+Card&region=all&pgType=homepage&rank=5",
    "ingred": [
      {
        "qty": 2,
        "item": "fresh butter beans or other shelling beans"
      },
      {
        "qty": "1",
        "item": "small bay leaf"
      },
      {
        "qty": "3 oz",
        "item": "thickly sliced pancetta or slab bacon, cut crosswise into 1/4-inch-wide lardons"
      },
      {
        "item": "Extra-virgin olive oil"
      },
      {
        "qty": "1",
        "item": "medium red onion, diced"
      }
    ],
    "steps": [
      "One",
      [
        "Two"
      ],
      [
        "Three"
      ]
    ]
  }
};



app.get('/', function(request, response) {

	response.set('Content-Type', 'text/html');
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// var indexPage = '';
	// indexPage += "<!DOCTYPE HTML><html><head><title>f</title></head><body><h1>Welcome to TBD</h1>";				
	// indexPage += "</body></html>"
					// response.send(indexPage);
	// response.sendfile('public/index2.html');

	var json = JSON.stringify(rawjson);
	 response.end(json);

});


app.get('/locations', function(request, response) {

	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('locs', function(error1, coll) {
		if(error1){
			console.log('Error: database collection not found');
			response.send(500);
		}
		
		var id = coll.find({}).toArray(function (error2, cursor) {
			if (error2) {
				console.log("Find faile :(");
				response.send(500);
			} else {
				console.log("Find succeeded!");
				console.log(cursor);
				response.send(cursor);
			}
		});
	});
});


 app.post('/addBusiness', function(request, response) {

	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var business = String(request.body.business);
	var cat = String(request.body.cat);
	var img1 = String(request.body.img1);
	var img2 = String(request.body.img2);
	var img3 = String(request.body.img3);
	var placeid = String(request.body.PlaceID);
	var toInsert = 
			{  "business" 	: business,
			   "cat"		: cat,
			   "img1" 		: img1,
			   "img2" 		: img2,
			   "img3" 		: img3,
			   "PlaceID"	: placeid    
			};
		// {"error" : "Whoops, something is wrong with your data!"}
	if (business && cat && placeid) {

		db.collection('locs', function(error1, coll) {

			coll.upsert( { business : business } , toInsert,  { upsert: true }, function(updateErr, updated) {

				if (updateErr) {
					response.send(500);
				}
				else {
					
						coll.find().toArray(function(err, info) {
				 		if(!err)
							response.send(info);
				}); }
		    });
		});

	}
	else {
		response.status(500);
	}
});


app.get('/addBusiness', function(request, res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
                // 'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
});


app.use(express.static('public'));

app.listen(process.env.PORT || 3000);