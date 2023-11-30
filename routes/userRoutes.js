const express = require('express');
const router = express.Router();

const util = require('../util');

const db = require('../database');
const User = require('../models/userModel');

// Profile view GET handler
router.get('/:userID', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('profile_view', {user: reqUser[0]});
});

// Name and Picture
router.get('/:userID/edit', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    res.render('edit_profile', {user: reqUser[0], schools: User.getAttributes().School_Name.values});
});

router.post('/:userID/save', util.upload.single('profilePicture'), async (req, res) => {
    const { 
        profilePicture, 
        user_name, 
        preferredName, 
        schoolDropdown, 
        committeeDropdown, 
        candidateStatement,
        serviceStatement 
    } = req.body;
    res.send(req.body);
});

// // Statement
// router.get('/:userID/statement', async (req, res) => {
//     const reqUser = await db.getUsers({
//         where: {
//             CWID: parseInt(req.params.userID)
//         }
//     });
//     res.render('statement', {user: reqUser[0]});
// });

// // Committees
// router.get('/:userID/committees', async (req, res) => {
//     const reqUser = await db.getUsers({
//         where: {
//             CWID: parseInt(req.params.userID)
//         }
//     });
//     res.render('committees', {user: reqUser[0]});
// });


module.exports = router;