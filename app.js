// Import required Node modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const CASAuthentication = require('express-cas-authentication');
//const util = require('./util');
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

// var cas = new CASAuthentication({
//     cas_url: 'https://auth.it.marist.edu/idp/profile/cas',
//     service_url: 'http://fac_voting.ecrl.marist.edu',
//     cas_version: "2.0",
//     renew: false,

//     session_name: 'cas_user',
//     session_info: 'attributes',

//     is_dev_mode: true,
//     dev_mode_user: '12345678@marist.edu',
//     dev_mode_info: { 
//         displayname: "John P Smith",
//         maristmailpref: "John.Smith@marist.edu",
//         cn: "John P Smith",
//         employeetype: "FACULTY",
//         udc_identifier: "12345678@marist.edu",
//         maristcwid: "12345678"
//     }
// });


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

const accountRoutes = require('./routes/accountRoutes');
app.use('/', accountRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', ensureAuthenticated, userRoutes);

// // Profile view GET handler
// app.get('/user/:userID', ensureAuthenticated, async (req, res) => {
//     const reqUser = await connection.getUsers({
//         where: {
//             CWID: parseInt(req.params.userID)
//         }
//     });
//     res.render('profile_view', {user: reqUser[0]});
// });

// // Name and Picture
// app.get('/name_and_picture', ensureAuthenticated, (req, res) => {
//     res.render('name_and_picture');
// });

// // Statement
// app.get('/statement', ensureAuthenticated, (req, res) => {
//     res.render('statement');
// });

// // Committees
// app.get('/committees', ensureAuthenticated, (req, res) => {
//     res.render('committees');
// });

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', ensureAdmin, adminRoutes);

//use custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404');
})

//use custom 401 page
app.use((req, res) => {
    res.status(401);
    res.render('401');
})

// // Admin view page (profile search) with middleware to check if user is admin
// app.get('/admin_view', ensureAdmin, async(req, res) => {
//     const reqSchools = await connection.getSchools();
//     const reqCommittees = await connection.getCommittees();
//     const reqUser = await connection.getUsers();
//     res.render('admin_view', {schools: reqSchools, committees: reqCommittees, faculty: reqUser});
// });

// // Admin View and Manage
// app.get('/view_and_manage', (req, res) => {
//     res.render('view_and_manage');
// });

// // Admin Query Preview
// app.get('/query_preview', (req, res) => {
//     res.render('query_preview');
// });

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
