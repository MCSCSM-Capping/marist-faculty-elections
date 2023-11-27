const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');

// Middleware to ensure admin authentication
const ensureAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin_login'); // redirect to admin login if not authenticated as admin
};

// Admin view page (profile search) with middleware to check if user is admin
router.get('/admin_view', async (req, res) => {
    const reqSchools = await db.getSchools();
    const reqCommittees = await db.getCommittees();
    const reqUser = await db.getUsers();
    res.render('admin_view', {schools: reqSchools, committees: reqCommittees, faculty: reqUser});
});

// Admin View and Manage
router.get('/view_and_manage', (req, res) => {
    res.render('view_and_manage');
});

// Admin Query Preview
router.get('/query_preview', (req, res) => {
    res.render('query_preview');
});

module.exports = router;