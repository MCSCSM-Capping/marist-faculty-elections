const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');
const FacComMap = require('../models/facultyCommitteeJunction');

// Admin view page (profile search) with middleware to check if user is admin
router.get('/admin_view', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers();
    if (req.session.selectedUser == null){
        req.session.selectedUser = reqUser[0].CWID;
    }
    res.render('admin_view', {schools: User.getAttributes().School_Name.values, committees: reqCommittees, faculty: reqUser, selectedUser: req.session.selectedUser});
});

// Admin View and Manage
router.get('/view_and_manage/:userID', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    console.log(req.params.userID)
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
router.get('/query_preview', (req, res) => {
    if (req.session.selectedUser = null){
        req.session.selectedUser = User[0].CWID;
    }
    res.render('query_preview', {selectedUser: req.session.selectedUser});
});

module.exports = router;