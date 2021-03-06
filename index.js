// load environment variables
require('dotenv').config();

// barebones item1: Requires express
var flash = require('connect-flash');
var express = require('express');
var layouts = require('express-ejs-layouts');
var methodOverride = require('method-override');
var parser = require('body-parser');
var passport = require('./config/passportConfig');
var session = require('express-session');

// barebones item2: Declare express app
var app = express();

// declare a reference to models folder
var db = require('./models'); //tells it to looks for a folder rather than a node named models?

// set views to EJS
app.set('view engine', 'ejs');

// MIDDLEWARE!! (takes place between font end/forms and routes)
app.use(layouts);
app.use('/', express.static('static'));
app.use(parser.urlencoded({extended: false}));
app.use(session({                             //needs to be before flash
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
})) 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


//CUSTOM MIDDLEWARE -- write data to locals
app.use(function(req, res, next){ // "next" = the callback function called next?
	res.locals.alerts = req.flash();
	res.locals.user = req.user;  //passport
	next();
});

// barebones item3: Declare routes
app.get('/', function(req, res){
	res.render('home');
});

// include controllers
app.use('/auth', require('./controllers/auth')); // auth = whatever path you want your routes in the controllers file
app.use('/profile', require('./controllers/profile'))

// barebones item4: Listen on port
app.listen(3000);