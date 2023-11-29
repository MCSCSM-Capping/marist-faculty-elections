const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');

const CASAuthentication = require('express-cas-authentication');
const util = require('../util');

var cas = new CASAuthentication({
    cas_url: 'https://auth.it.marist.edu/idp/profile/cas',
    service_url: 'http://fac-voting.ecrl.marist.edu',
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

router.get('/authenticate', cas.bounce, async (req, res) => {

    //first checks if a user is faculty. If they are not, sends a 401 and exits.
    if (!util.userIsFaculty(req, cas)) {
        return res.sendStatus(401);
    } else {
        req.session.isUserAuthenticated = true;
    }

    let reqCWID, reqFirst, reqLast;
    reqCWID = parseInt(req.session[cas.session_info].maristcwid);

    let nameArr = JSON.stringify(req.session[cas.session_info].cn).split(' ');

    reqFirst = nameArr[0].slice(1);//removes open quote
    reqLast = nameArr[nameArr.length - 1].slice(0, (nameArr[nameArr.length - 1].length - 1)); //removes close quote

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
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";  // PLEASE change this to something more secure, even for testing

router.post('/admin_authenticate', (req, res) => {
    const { username, password } = req.body; 

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/admin/admin_view');
    } else {
        res.send('Incorrect username or password');
    }
});

module.exports = router;