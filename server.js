// server.js

// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var jwt        = require("jsonwebtoken");
	//var vary = require('vary');
	//var cors = require('cors');

// configuration =================

    mongoose.connect('mongodb://chrisloomis13:m1N!Crisp@ds011271.mlab.com:11271/dzc');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

// define model =================

	var Weapon = mongoose.model('Weapon', {
		name : String
	});

	var User = mongoose.model('Weapon', {
		name : String
	});

// routes ======================================================================
	app.use(function(req, res, next) {
		  res.set('Access-Control-Allow-Origin', '*');
		  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
		  res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
		  next();
	});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

    // api ---------------------------------------------------------------------
    // get all units
	app.post('/authenticate', function(req, res) {
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
			if (err) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
				   res.json({
						type: true,
						data: user,
						token: user.token
					}); 
				} else {
					res.json({
						type: false,
						data: "Incorrect email/password"
					});    
				}
			}
		});
	});

	app.post('/signin', function(req, res) {
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
			if (err) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
					res.json({
						type: false,
						data: "User already exists!"
					});
				} else {
					var userModel = new User();
					userModel.email = req.body.email;
					userModel.password = req.body.password;
					userModel.save(function(err, user) {
						user.token = jwt.sign(user, process.env.JWT_SECRET);
						user.save(function(err, user1) {
							res.json({
								type: true,
								data: user1,
								token: user1.token
							});
						});
					})
				}
			}
		});
	});

//cors(corsOptionsDelegate),
	app.get('/api/weapons', ensureAuthorized, function(req, res) {
		Weapon.find(function(err, weapons) {
			if (err)
				res.send(err);
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.json(weapons);
		});
	});

//app.options('/api/weapons', cors());
app.post('/api/weapons', ensureAuthorized, function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        // create a unit, information comes from AJAX request from Angular
        Weapon.create({
            name : req.body.name
        }, function(err, unit) {
            if (err)
                res.send(err);

            // get and return all the units after you create another
            Unit.find(function(err, units) {
                if (err)
                    res.send(err);
				res.setHeader("Access-Control-Allow-Origin", "*");
                res.json(units);
            });
        });
    });


// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

	process.on('uncaughtException', function(err) {
		console.log(err);
	});
// listen (start app with node server.js) ======================================
    app.listen(process.env.PORT || 8080);
    console.log("App listening on port 8080");
