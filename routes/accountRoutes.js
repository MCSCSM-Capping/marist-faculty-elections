const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

const CASAuthentication = require('express-cas-authentication');
const util = require('../util');

var cas = new CASAuthentication({
    cas_url: 'https://auth.it.marist.edu/idp/profile/cas',
    service_url: 'https://fac-voting.ecrl.marist.edu',
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
    },
    destroy_session: true
});

router.get('/authenticate', cas.bounce, async (req, res) => {
    //first check to ensure the session is not already logged in
    if (req.session.isAdmin) {
        res.redirect('/admin/admin_view');
    } else if (req.session.user != null) {
        res.redirect(`/user/${req.session.user}`);
    }

    let reqCWID = parseInt(req.session[cas.session_info].maristcwid);

    //first checks if a user is faculty. If they are not, sends a 401 and exits.
    if (!util.userIsFaculty(req, cas)) {
        return res.sendStatus(401);
    } else {
        req.session.isUserAuthenticated = true;
        req.session.user = reqCWID;
    }
    
    let reqFirst, reqLast; //first and last name from CAS object

    let nameArr = (req.session[cas.session_info].cn).split(' ');

    reqFirst = nameArr[0];//removes open quote
    reqLast = nameArr[nameArr.length - 1]; //removes close quote

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

router.get('/logout', cas.logout);

// Admin login page
router.get('/admin_login', (req, res) => {
    res.render('admin_login');
});

// Admin login POST handler
router.post('/admin_authenticate', async (req, res) => {
    //first check to ensure the session is not already logged in, admin or otherwise
    if (req.session.isAdmin) {
        res.redirect('/admin/admin_view');
    } else if (req.session.user != null) {
        res.redirect(`/user/${req.session.user}`);
    }
    const { username, password } = req.body; 

    reqCredentials = await db.getCredentials({
        where: {
            Username: username
        }
    });
    if (reqCredentials[0] == null){ //if no account with that username exists, the username is incorrect
        res.send('Incorrect username or password');
    }else{ //account with that username is found
        //easier access for variables
        reqUsername = reqCredentials[0].Username;
        reqPassword = reqCredentials[0].Admin_Password;
        reqSalt = reqCredentials[0].Salt;
    
        passwordHash = util.hashPassword(password, reqSalt);
    
        if (passwordHash === reqPassword) {
            req.session.isAdmin = true;
            req.session.user = 'admin';
            res.redirect('/admin/admin_view');
        } else {
            res.send('Incorrect username or password');
        }
    }
});

module.exports = router;