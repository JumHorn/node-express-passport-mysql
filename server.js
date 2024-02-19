// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);
var dbconnection = require('./config/connection').connection;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 58081;

var passport = require('passport');
var flash = require('connect-flash');
// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

var sessionStore = new mysqlStore({
	clearExpired: true,
	checkExpirationInterval: 2147483647, //a month 2592000000
}, dbconnection);

// required for passport
app.use(session({
	secret: '8390f984-cee0-11ee-b656-577fdb85d159',
	resave: false,
	saveUninitialized: false,
	store: sessionStore, // 创建 MySQLStore 实例
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30,//a month
		sameSite: true
	}
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port,'127.0.0.1');
console.log('The magic happens on port ' + port);
