/**
All routes for admin pages.

These routes are prepended with '/admin/' in the URL
*/

//routes and backend code for admin users
const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');
const FacComMap = require('../models/facultyCommitteeJunction');

// Admin view page (profile search) with middleware to check if user is admin
router.get('/admin_view', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers();
    const reqUsersCommittees = await db.getFullFacultyCommittees();
    if (req.session.selectedUser == null){
        req.session.selectedUser = reqUser[0].CWID;
    }
    res.render('admin_view', {schools: User.getAttributes().School_Name.values, committees: reqCommittees, faculty: reqUser, selectedUser: req.session.selectedUser, usersCommittees: reqUsersCommittees});
});

// Admin View and Manage
router.get('/view_and_manage/:userID', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });

    let userCommittees;

    if(reqUser[0].Is_On_Committee) {
        userCommittees = await db.getFacultyCommittees(req.params.userID);
    } else {
        userCommittees = null;
    }
    req.session.selectedUser = reqUser[0].CWID;
    res.render('view_and_manage', {schools: User.getAttributes().School_Name.values, userCommittees: userCommittees, faculty: reqUser[0], selectedUser: req.session.selectedUser});
});

// Admin Query Preview
router.get('/query_preview', async (req, res) => {
    const reqUser = await db.getUsers();
    if (req.session.selectedUser == null){
         req.session.selectedUser = reqUser[0].CWID;
    }
    
    res.render('query_preview', {facultyList: JSON.stringify(reqUser), selectedUser: req.session.selectedUser});
});

//Change selected faculty member's school
router.post('/view_and_manage/:userID/change_school', async (req, res) => {
    //req.body contains school name 
    const {schoolDropdown} = req.body;
    //req.params.userID comes from route url
    const userID = parseInt(req.params.userID);

    //update Faculty table to change the school for correct CWID 
    await User.update({
        School_Name: schoolDropdown
    }, {
        where: {
            CWID: userID
        }
    });
    //send back to view_and_manage
    res.redirect(`/admin/view_and_manage/${userID}`);
});

//change RecActive column to "N" for selected user
router.post('/view_and_manage/:userID/delete_profile', async (req, res) => {
    const userID = parseInt(req.params.userID);
    
    await User.update({
        RecActive: "N"
    }, {
        where: {
            CWID: userID
        }
    });
    res.redirect(`/admin/view_and_manage/${userID}`);
});

//change RecActive column to "Y" for selected user
router.post('/view_and_manage/:userID/activate_profile', async (req, res) => {
    const userID = parseInt(req.params.userID);
    
    await User.update({
        RecActive: "Y"
    }, {
        where: {
            CWID: userID
        }
    });
    res.redirect(`/admin/view_and_manage/${userID}`);
});

//admin logout
router.get('/logout_admin', (req, res) => {
    //https://stackoverflow.com/questions/51430267/logout-in-nodejs
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;