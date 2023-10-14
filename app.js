// Import required Node modules
const express = require('express');
const path = require('path');
const session = require('express-session');

// Initialize the server application
const app = express();

// Session data and cookie setup for users
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Landing/Homepage
app.get('/', (req, res) => {
    res.render('landing');
});

// Using a POST method for profile seems unconventional unless you're handling form data.
// Keeping it here for your use, but if it's not necessary, consider removing it.
app.post('/home', (req, res) => {
    res.render('profile_view');
});

// Profile view
app.get('/profile_view', (req, res) => {
    res.render('profile_view');
});

// Name and Picture
app.get('/name_and_picture', (req, res) => {
    res.render('name_and_picture');
});

// Statement
app.get('/statement', (req, res) => {
    res.render('statement');
});

// Committees
app.get('/committees', (req, res) => {
    res.render('committees');
});

app.listen(3000, () => {
    console.log('App Listening to port 3000');
});
