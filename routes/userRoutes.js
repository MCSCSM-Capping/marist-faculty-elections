const express = require('express');
const router = express.Router();

const db = require('../database');
const User = require('../models/userModel');

// Profile view GET handler
router.get('/:userID', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('profile_view', {user: reqUser[0], schools: User.getAttributes().School_Name.values});
});

// Name and Picture
router.get('/:userID/name_and_picture', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('name_and_picture', {user: reqUser[0]});
});

// Statement
router.get('/:userID/statement', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('statement', {user: reqUser[0]});
});

// Committees
router.get('/:userID/committees', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('committees', {user: reqUser[0]});
});


module.exports = router;