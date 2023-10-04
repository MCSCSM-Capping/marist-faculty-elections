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


app.listen(3000, () => {
    console.log('App Listening to port 3000');
});