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

    const userID = parseInt(req.params.userID);
    
    const reqUser = await db.getUsers({
        where: {
            CWID: userID
        }
    });

    //Updating basic info
    await User.update({
        //First_Name: TODO,
        //Last_Name: TODO,
        Preferred_Name: preferredName,
        School_Name: schoolDropdown,
        Candidate_Statement: candidateStatement,
        Service_Statement: serviceStatement
    }, {
        where: {
            CWID: userID
        }
    });

    res.redirect(`/user/${userID}`);
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