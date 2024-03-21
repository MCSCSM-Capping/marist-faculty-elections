/*
This is the engine for the Node server. This is where initial set up takes place, as well as imports of
Node modules used and the .env file. This file also creates some helper functions for ensuring user
authentication.

The app runs using Express sessions. If the project is in production mode (set in .env), it will host it
on port 443. Otherwise, it will be hosted on port 3000 for local testing.

Routing is handled through the Express router, and passed to its respective routers from here.

This file also contains the index routes, i.e. the landing page.
*/


// Import required Node modules
const https = require('https');
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const memoryStore = require('memorystore')(session);
//const CASAuthentication = require('express-cas-authentication');
//const util = require('./util');
var connection = require('./database');
const fs = require('fs');

//environment setup
require('dotenv').config();

console.log("Current status: " + process.env.STATUS);

const app = express();

// Session data and cookie setup for users
app.use(session({
    secret: 'secret key',
    saveUninitialized: false,
    store: new memoryStore({
        checkPeriod: 30 * 60 * 1000 //prunes expired sessions every 30 minutes
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 //sessions expire after 24 hours
    },
    resave: false
}));

// Setup for public, cookies, and rendering engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.set('view engine', 'ejs');

// Middleware to ensure user authentication
const ensureAuthenticated = (req, res, next) => {
    if (req.session.isUserAuthenticated) {
        return next();
    }
    res.redirect('/'); // redirect to landing if not authenticated
};

// Middleware to ensure admin authentication
const ensureAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin_login'); // redirect to admin login if not authenticated as admin
};

// Landing/Homepage
app.get('/', (req, res) => {
    //first check to ensure the session is not already logged in, admin or otherwise
    if (req.session.isAdmin) {
        res.redirect('/admin/admin_view');
    } else if (req.session.user != null) {
        res.redirect(`/user/${req.session.user}`);
    }
    res.render('landing');
});

const accountRoutes = require('./routes/accountRoutes');
app.use('/', accountRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', ensureAuthenticated, userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', ensureAdmin, adminRoutes);

//use custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404');
})

if (process.env.STATUS === 'production') {
    //ssl handling
    var privateKey = fs.readFileSync(`${process.env.KEY_PATH}`);
    var certificate = fs.readFileSync(`${process.env.CERT_PATH}`);

    https.createServer({
        key: privateKey,
        cert:certificate
    }, app).listen(3000, () => {
        console.log('HTTPS Listening on port 3000 (internal), mapped to port 443 (external)');
    });
} else {
//port app is listening on
    app.listen(3000, () => {
        console.log('App Listening to port 3000');
    });
}