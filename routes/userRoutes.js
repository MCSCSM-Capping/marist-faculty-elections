const express = require('express');
const router = express.Router();

const util = require('../util');

const db = require('../database');
const User = require('../models/userModel');
const FacComMap = require('../models/facultyCommitteeJunction')

// Profile view GET handler
router.get('/:userID', async (req, res) => {
    userID = parseInt(req.params.userID);
    const reqUser = await db.getUsers({
        where: {
            CWID: userID
        }, 
    });
    let userCommittees;

    if(reqUser[0].Is_On_Committee) {
        userCommittees = await db.getFacultyCommittees(userID);
    } else {
        userCommittees = null;
    }

    res.render('profile_view', {user: reqUser[0], userCommittees: userCommittees});
});

// Name and Picture
router.get('/:userID/edit', async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    const reqCommittees = await db.getCommittees();
    res.render('edit_profile', {user: reqUser[0], schools: User.getAttributes().School_Name.values, committees: reqCommittees});
});

router.post('/:userID/save', util.upload.single('profilePicture'), async (req, res) => {
    const { 
        firstName,
        lastName, 
        preferredName, 
        schoolDropdown, 
        selectedCommittees, 
        candidateStatement,
        serviceStatement 
    } = req.body;

    const userID = parseInt(req.params.userID);

    let hasCommitties;

    let committeeArray;

    console.log(selectedCommittees);

    //Formatting out the open and end quotes
    committeeString = JSON.stringify(selectedCommittees);
    committeeString = committeeString.substring(1, (committeeString.length - 1))


    console.log(committeeString);

    //if empty
    if (JSON.stringify(selectedCommittees) === ""){
        hasCommitties = false;
    } else {
        committeeArray = committeeString.split(',');
        hasCommitties = true;
    }

    const reqUser = await db.getUsers({
        where: {
            CWID: userID
        }
    });

    //Updating basic info
    await User.update({
        First_Name: firstName,
        Last_Name: lastName,
        Preferred_Name: preferredName,
        School_Name: schoolDropdown,
        Candidate_Statement: candidateStatement,
        Service_Statement: serviceStatement
    }, {
        where: {
            CWID: userID
        }
    });

    //Update committees
    //only updates committees if there were committees selected by the user
    if (hasCommitties) {
        //remove all mappings of the committees for this user first
        FacComMap.destroy({
            where: {
                CWID: userID
            }
        });

        committeeArray.forEach((e) => {
            let committeeID = parseInt(e);
            //creates a new mapping
            FacComMap.create({
                CWID: userID,
                Committee_ID: committeeID
            });
        });

        //updates that the user is on a committee
        await User.update({ Is_On_Committee: true }, {
            where: {
                CWID: userID
            }
        });

    } else { //if no committees, set that the faculty is not on a committee
        await User.update({ Is_On_Committee: false }, {
            where: {
                CWID: userID
            }
        });
    }


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