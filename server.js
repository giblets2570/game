
// server.js

// modules =================================================
var express        	= require('express');
var app            	= express();
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var mongoose       	= require('mongoose');
var flash    	   	= require('connect-flash');
var session      	= require('express-session');
// var redis 			= require('redis');
// var client 			= redis.createClient(); //creates a new client
// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// required for passport
// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session


// client.on('connect', function() {
//     console.log('connected');
// });

// client.set('framework', 'AngularJS', function(err, reply) {
//   console.log(reply);
// });

// client.get('framework', function(err, reply) {
//     console.log(reply);
// });

// client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

// client.hgetall('frameworks', function(err, object) {
//     console.log(object);
// });

// routes ==================================================

require('./app/routes')(app,express); // configure our routes

app.use(function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
});


// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;

