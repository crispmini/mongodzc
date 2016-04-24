// server.js

// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

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
		weapons : [Number]
	});

	var Weapon = mongoose.model('Weapon', {
		name : String
	});

// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all units
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

app.post('/api/weapons', function(req, res) {
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
                res.json(units);
            });
        });

    });

app.put('/api/units/:unit_id/weapon', function(req, res) {
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
