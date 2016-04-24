//set up
var express = require('express');
var app = express();								// create our app w/ express
var mongoose = require('mongoose');					// mongoose for mongodb
var morgan = require('morgan');						// log requests to the console (express4)
var bodyParser = require('body-parser');			// pull information from HTML POST (express4)
var methodOverride = require('method-override');	// simulate DELETE and PUT (express4)

app.set('port', 3000);
//configuration
mongoose.connect('mongodb://chrisloomis13:m1N!Crisp@ds011271.mlab.com:11271/dzc', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

app.use(express.static(__dirname + '/public'));					// set the static files location /public/img will be /img for users
app.use(morgan('dev'));											// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));			// parse application/x-www-form-urlencoded
app.use(bodyParser.json());										// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));	// parse application/vnd.api+json as json
app.use(methodOverride());

app.set('port', 3000);

var units = require('./routes/units');
app.use('/units', units);

var weapons = require('./routes/weapons');
app.use('/weapons', weapons);

app.get('*',function(req,res){
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/other-page',function(req,res){
  res.type('text/plain');
  res.send('Welcome to the other page!');
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});