const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('landing');
});

app.listen(3000, () => {
    console.log('App Listening to port 3000');
});