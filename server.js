// server.js

// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
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
    var Unit = mongoose.model('Unit', {
		faction : String,
		name : String,
		a : Number,
		mv : Number,
		cm : String,
		dp : Number,
		pts : Number,
		type : String,
		category : String,
		coh : String,
		specrules : String,
		weapons : []
	});

	var Weapon = mongoose.model('Weapon', {
		name : String
	});

	var User = mongoose.model('User', {
		name : String,
		pass : String,
		wpns : []
	});

// routes ======================================================================
	var allowCrossDomain = function(req, res, next) {
				if ('OPTIONS' == req.method) {
					res.set('Access-Control-Allow-Origin', '*');
					res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
					res.set('Access-Control-Allow-Headers', 'Content-Type');
					res.status(200).send();
				}
				else {
					res.header('Access-Control-Allow-Origin', '*');
					next();
				}
			};
			app.use(allowCrossDomain);

    // api ---------------------------------------------------------------------
    // get all units
	app.post('/authenticate', function(req,res) {
		User.findOne({'name':req.body.name,'pass':req.body.pass}, function(err,data){
			if(err)
				res.send(err);
			if(!data)
				res.status(403).send();
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.json(data);
		})
	});
	
	app.post('/signup', function(req,res) {
			User.create({
				name : req.body.name,
				pass : req.body.pass
			}, function(err, user) {
				if (err)
					res.send(err);
				User.findOne({'name':req.body.name,'pass':req.body.pass}, function(err,data){
					if(err)
						res.send(err);
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.json(data);
				});
			});
	});

    app.get('/api/units', function(req, res) {

        // use mongoose to get all units in the database
        Unit.find(function(err, units) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(units); // return all units in JSON format
        });
    });

	app.get('/api/weapons', function(req, res) {
		Weapon.find(function(err, weapons) {
			if (err)
				res.send(err);
			//res.setHeader("Access-Control-Allow-Origin", "*");
			res.json(weapons);
		});
	});

    // create unit and send back all units after creation
    app.post('/api/units', function(req, res) {
		var errFlag = 0;
		var errMsg = "Failed for following reasons:"
		if(req.body.faction == ""){
			errFlag++;
			errMsg += "\nNo Faction";
		}
		if(req.body.name == ""){
			errFlag++;
			errMsg += "\nNo Name";
		}
		if(req.body.a < 1 || req.body.a > 10){
			errFlag++;
			errMsg += "\na (Armor) must be between 1 and 10";
		}
		if(req.body.mv < 0){
			errFlag++;
			errMsg += "\nmv (Movement) must be 0 or more";
		}
		if(req.body.dp < 1){
			errFlag++;
			errMsg += "\ndp (Damage Points) must be 1 or more";
		}
		if(req.body.pts < 0){
			errFlag++;
			errMsg += "\npts (Points) must be 0 or more";
		}
		
		if(errFlag > 0){
			res.type('text/plain');
			res.status(400);
			res.send(errMsg);
		}
		else
        // create a unit, information comes from AJAX request from Angular
        Unit.create({
			faction : req.body.faction,
            name : req.body.name,
			a : req.body.a,
			mv : req.body.mv,
			cm : req.body.cm,
			dp : req.body.dp,
			pts : req.body.pts,
			type : req.body.type,
			category : req.body.category,
			coh : req.body.coh,
			specrules : req.body.specrules
        }, function(err, unit) {
            if (err)
                res.send(err);

            // get and return all the units after you create another
            Unit.find(function(err, units) {
                if (err)
                    res.send(err);
                res.json(units);
            });
        });
		
    });

	// edit a unit
	app.get('/api/units/:unit_id', function(req, res) {
		Unit.findOne({
			_id : req.params.unit_id
		}, function(err, unit) {
			if (err)
				res.send(err);
			
			res.json(unit);
		});
	});

	app.put('/api/units/:unit_id', function(req, res) {
		Unit.update({_id : req.params.unit_id}, { $set: {
			faction : req.body.faction,
            name : req.body.name,
			a : req.body.a,
			mv : req.body.mv,
			cm : req.body.cm,
			dp : req.body.dp,
			pts : req.body.pts,
			type : req.body.type,
			category : req.body.category,
			coh : req.body.coh,
			specrules : req.body.specrules
		}}, function(err, unit) {
			if(err)
				res.send(err);
			
			// get and return all the units after you create another
            Unit.find(function(err, units) {
                if (err)
                    res.send(err);
                res.json(units);
            });
		});
	});

    // delete a unit
    app.delete('/api/units/:unit_id', function(req, res) {
        Unit.remove({
            _id : req.params.unit_id
        }, function(err, unit) {
            if (err)
                res.send(err);

            // get and return all the units after you create another
            Unit.find(function(err, units) {
                if (err)
                    res.send(err);
                res.json(units);
            });
        });
    });
//app.options('/api/weapons', cors()); cors(corsOptionsDelegate)
app.post('/api/weapons', function(req, res) {
	//res.setHeader("Access-Control-Allow-Origin", "*");
	//res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	//res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
				//res.setHeader("Access-Control-Allow-Origin", "*");
                res.json(units);
            });
        });

    });

app.post('/api/userweapons', function(req, res) {
	User.findOne({'_id':req.body.id}, function(err,data){
		if(err)
			res.send(err);
		//res.setHeader("Access-Control-Allow-Origin", "*");
		var weapons = [];
		for(var i=0; i<data.wpns.length; i++){
			Weapon.findOne({'_id':data.wpns[i]}, function(err,wname){
				weapons.push(wname.name);
			})
		}
		res.json({'userweapons':weapons});
	})
});

app.put('/api/userweapons', function(req, res) {
	User.findOneAndUpdate({'_id':req.body.id},
						  {$push: {'wpns':req.body.weapon}},
						  {safe: true, upsert: true},
						  function(err,data){
							if(err)
								res.send(err);
		//res.setHeader("Access-Control-Allow-Origin", "*");
		//res.json(data);
	})
});

app.put('/api/units/:unit_id/weapon', function(req, res) {console.log("server.js - id="+req.body.unit_id+" weapon="+req.body.weapon_id);
		Unit.update({_id : req.body.unit_id}, 
					{ $push: {weapons : req.body.weapon_id}}
		, function(err, unit) {
			if(err)
				res.send(err);
			
			// get and return all the units after you create another
            Unit.find(function(err, units) {
                if (err)
                    res.send(err);
                res.json(units);
            });
		});
	});


// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

// listen (start app with node server.js) ======================================
    app.listen(process.env.PORT || 8080);
    console.log("App listening on port 8080");
