const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');

// Admin view page (profile search) with middleware to check if user is admin
router.get('/admin_view', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers();
    res.render('admin_view', {schools: User.getAttributes().School_Name.values, committees: reqCommittees, faculty: reqUser});
});

// Admin View and Manage
router.get('/view_and_manage/:userID', async (req, res) => {
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('view_and_manage', {schools: User.getAttributes().School_Name.values, committees: reqCommittees, faculty: reqUser[0]});
});

// Admin Query Preview
router.get('/query_preview', (req, res) => {
    res.render('query_preview');
});

module.exports = router;