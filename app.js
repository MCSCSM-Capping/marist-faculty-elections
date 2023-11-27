// Import required Node modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const CASAuthentication = require('express-cas-authentication');
const util = require('./util');
var connection = require('./database');

//model import
const User = require('./models/userModel');
const School = require('./models/schoolModel');
const Committee = require('./models/committeeModel');
//const { name } = require('ejs');

const app = express();

// Session data and cookie setup for users
app.use(session({
    secret: 'secret key',
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.set('view engine', 'ejs');

var cas = new CASAuthentication({
    cas_url: 'https://auth.it.marist.edu/idp/profile/cas',
    service_url: 'http://fac_voting.ecrl.marist.edu',
    cas_version: "2.0",
    renew: false,

    session_name: 'cas_user',
    session_info: 'attributes',

    is_dev_mode: true,
    dev_mode_user: '12345678@marist.edu',
    dev_mode_info: { 
        displayname: "John P Smith",
        maristmailpref: "John.Smith@marist.edu",
        cn: "John P Smith",
        employeetype: "FACULTY",
        udc_identifier: "12345678@marist.edu",
        maristcwid: "12345678"
    }
});


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
    res.render('landing');
});

app.get('/authenticate', cas.bounce, async (req, res) => {

    //first checks if a user is faculty. If they are not, sends a 401 and exits.
    if (!util.userIsFaculty(req, cas)) {
        return res.sendStatus(401);
    } else {
        req.session.isUserAuthenticated = true;
    }

    let reqCWID, reqFirst, reqLast;
    reqCWID = parseInt(req.session[cas.session_info].maristcwid);

    let nameArr = JSON.stringify(req.session[cas.session_info].cn).split(' ');

    reqFirst = nameArr[0];
    reqLast = nameArr[nameArr.length - 1];

    //checks if a user with the logged in CWID exists in the database. If not, creates a new entry in the Faculty table of the database
    const user = await User.findOrCreate({
        where: { CWID: reqCWID },
        defaults: {
            RecActive: 'Y',
            First_Name: reqFirst,
            Last_Name: reqLast,
        }
    });

    //updates the URL if applicable
    if (user.Website_URL === null) {
        User.update({Website_URL: util.parseURL(req, res)}, {
            where: {
                CWID: reqCWID,
                Website_URL: null
            }
        })
    }


    res.redirect(`/user/${reqCWID}`);
});

app.get('/logout', cas.logout);

// Profile view GET handler
app.get('/user/:userID', ensureAuthenticated, async (req, res) => {
    const reqUser = await connection.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('profile_view', {user: reqUser[0]});
});

// Profile view POST handler
//defunct code
// app.post('/profile_view', (req, res) => {
//     req.session.isUserAuthenticated = true; 
//     res.render('profile_view');
// });

// Name and Picture
app.get('/name_and_picture', ensureAuthenticated, (req, res) => {
    res.render('name_and_picture');
});

// Statement
app.get('/statement', ensureAuthenticated, (req, res) => {
    res.render('statement');
});

// Committees
app.get('/committees', ensureAuthenticated, (req, res) => {
    res.render('committees');
});

// Admin login page
app.get('/admin_login', (req, res) => {
    res.render('admin_login');
});

// Admin login POST handler
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";  // PLEASE change this to something more secure, even for testing

app.post('/admin_authenticate', (req, res) => {
    const { username, password } = req.body; 

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/admin_view');
    } else {
        res.send('Incorrect username or password');
    }
});

// Admin view page (profile search) with middleware to check if user is admin
app.get('/admin_view', ensureAdmin, async(req, res) => {
    const reqSchools = await connection.getSchools();
    const reqCommittees = await connection.getCommittees();
    res.render('admin_view', {schools: reqSchools, committees: reqCommittees});
});

// Admin View and Manage
app.get('/view_and_manage', (req, res) => {
    res.render('view_and_manage');
});

// Admin Query Preview
app.get('/query_preview', (req, res) => {
    res.render('query_preview');
});

//app.post('/admin_getData', async (req, res) => {
app.post('/admin_getSchools', (req, res) => {
    connection.query("SELECT School_Name FROM Schools;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
            //console.log(JSON.stringify(result));
        }
    });
});


app.post('/admin_getCommittees', (req, res) => {
    connection.query("SELECT Committee_Name FROM Committees;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/admin_getFacultyData', (req, res) => {
    connection.query("SELECT F.Last_Name, F.First_Name, F.Preferred_Name, S.School_Name, C.Committee_Name FROM Faculty F, Schools S, Committees C , Faculty_Committees FC WHERE F.School_ID = S.School_ID AND C.Committee_ID = FC.Committee_ID AND FC.CWID = F.CWID;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/profile_getFacultyData', (req, res) => {
    connection.query("SELECT F.Last_Name, F.First_Name, F.Preferred_Name, S.School_Name, C.Committee_Name , F.Service_Statement, F.Candidate_Statement, F.Is_On_Committee, F.Website_URL FROM Faculty F, Schools S, Committees C , Faculty_Committees FC WHERE F.School_ID = S.School_ID AND C.Committee_ID = FC.Committee_ID AND FC.CWID = F.CWID;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});

app.post('/nameAndPicture_getFacultyData', (req, res) => {
    connection.query("SELECT F.Last_Name, F.First_Name, F.Preferred_Name, S.School_Name, F.Website_URL FROM Faculty F, Schools S WHERE F.School_ID = S.School_ID;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/statements_getStatements', (req, res) => {
    connection.query("SELECT F.Service_Statement, F.Candidate_Statement FROM Faculty F;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});

app.post('/committees_getCommittees', (req, res) => {
    connection.query("SELECT F.Is_On_Committee, C.Committee_Name FROM Faculty F, Committees C , Faculty_Committees FC WHERE C.Committee_ID = FC.Committee_ID AND FC.CWID = F.CWID;", (err, result) =>{
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(result);
        }
    });
});


app.post('/sql', (req, res) => {
    console.log("At /SQL");
    connection.query("SELECT School_Name FROM Schools;", (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(JSON.stringify(result[0]));
            console.log(result[0]);
        }
    });
    console.log("Past query");
});

//port app is listening on
app.listen(3000, () => {
    console.log('App Listening to port 3000');

});
