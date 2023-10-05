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

app.get('/', (req, res) => {
    res.render('landing');
});

app.post('/home', (req, res) => {
    res.render('profile_view');
});

app.get('/profile', (req, res) => {
    res.render('profile_view');
});

app.get('/picture', (req, res) => {
    res.render('name_and_picture');
});

app.get('/statement', (req, res) => {
    res.render('statement');
});

app.get('/committees', (req, res) => {
    res.render('committees');
});

app.listen(3000, () => {
    console.log('App Listening to port 3000');
});