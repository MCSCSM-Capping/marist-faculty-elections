const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/home', (req, res) => {
    res.render('homepage');
});

app.listen(3000, () => {
    console.log('App Listening to port 3000');
});