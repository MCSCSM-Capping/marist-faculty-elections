const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'views')));

// app.get('/', (req, res) => {
//     res.('homepage.html');
// });

app.listen(3000, () => {
    console.log('App Listening to port 3000');
});