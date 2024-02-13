const express = require('express');
const router = express.Router();

const util = require('../util');

const db = require('../database');
const User = require('../models/userModel');
const FacComMap = require('../models/facultyCommitteeJunction');
const session = require('express-session');
const Committee = require('../models/committeeModel');

// Middleware to limit users only to their own pages
const isPageOwner = (req, res, next) => {
    if (req.session.user == req.params.userID) {
        return next();
    }

    if (req.session.isAdmin) {
        return res.redirect("/admin/admin_view");
    }

    res.redirect(`/user/${req.session.user}`);
};


// Profile view GET handler
router.get('/:userID', isPageOwner, async (req, res) => {
    userID = parseInt(req.params.userID);
    const reqUser = await db.getUsers({
        where: {
            CWID: userID
        }
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
router.get('/:userID/edit', isPageOwner, async (req, res) => {
    const reqUser = await db.getUsers({
        where: {
            CWID: parseInt(req.params.userID)
        }
    });
    const reqCommittees = await db.getCommittees();
    let userCommittees;

    if(reqUser[0].Is_On_Committee) {
        userCommittees = await db.getFacultyCommittees(userID);
    } else {
        userCommittees = null;
    }
    res.render('edit_profile', {user: reqUser[0], schools: User.getAttributes().School_Name.values, committees: reqCommittees, userCommittees: JSON.stringify(userCommittees)});
});

router.post('/:userID/save', isPageOwner, util.upload.single('profilePicture'), async (req, res) => {
    const { 
        firstName,
        lastName, 
        preferredName, 
        schoolDropdown, 
        selectedCommittees, 
        candidateStatement,
        serviceStatement,
        websiteURL
    } = req.body;

    const userID = parseInt(req.params.userID);

    let hasCommitties;

    let committeeArray;
    console.log("here: " + (selectedCommittees))
    //Formatting out the open and end quotes
    committeeString = JSON.stringify(selectedCommittees);
    committeeString = committeeString.substring(1, (committeeString.length - 1));

    console.log("Committee String: ", committeeString, "              %%%%%%%%%%%%%%");

    //if empty
    if (committeeString.length === 0){
        hasCommitties = false;
    } else {
        committeeArray = committeeString.split(',');
        hasCommitties = true;
    }
    // const reqUser = await db.getUsers({
    //     where: {
    //         CWID: userID
    //     }
    // });

    //Updating basic info
    await User.update({
        First_Name: firstName,
        Last_Name: lastName,
        Preferred_Name: preferredName,
        School_Name: schoolDropdown,
        Candidate_Statement: candidateStatement,
        Service_Statement: serviceStatement,
        Is_On_Committee: hasCommitties,
        Website_URL: websiteURL
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

        for (let i = 0; i < committeeArray.length; i+=2) {
            let committeeID = committeeArray[i+1];
            let committeeName = committeeArray[i];
            
            //create new committee if it doesn't exist
            console.log(committeeName, " committee number: ", committeeID);
            const committee = await db.getCommittees({
                where: {
                    Committee_ID: committeeID
                }
            });
            if (committee[0] == null){ //if no committee with that id exists, that committee needs to be added
                console.log("**********YIPPEEEEEE***************");
                await Committee.findOrCreate({
                    where: { Committee_ID: committeeID },
                    defaults: {
                        Committee_Name: committeeName
                    }
                });
            }

            //creates a new mapping
            FacComMap.create({
                CWID: userID,
                Committee_ID: committeeID
            });
        }
        committeeArray.forEach( async (e, committeeName) => {
            // //let committeeName = committeeArray;
            
            // //create new committee if it doesn't exist
            // console.log(committeeName, " committee number: ", e);
            // const committee = await db.getCommittees({
            //     where: {
            //         Committee_ID: e
            //     }
            // });
            // if (committee[0] == null){ //if no account with that username exists, the username is incorrect
            //     console.log("**********YIPPEEEEEE***************");
            // }

            // //creates a new mapping
            // FacComMap.create({
            //     CWID: userID,
            //     Committee_ID: e
            // });
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