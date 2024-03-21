const URL = require("url").URL;
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Function to check if user logging in is not a student
module.exports.userIsFaculty = function(req, cas) {
    if (JSON.stringify(req.session[ cas.session_info ].employeetype).includes("FACULTY")) {
        return true;
    } else {
        return false;
    }
}

// Function to parse the logged in user's name and attempt to find their school and website URL
module.exports.parseURL = function(req, cas) {
    let nameArr = JSON.stringify(req.session[cas.session_info].cn).split(' ');
    let nameURL = nameArr[0] + '-' + nameArr[nameArr.length - 1];

    if (stringIsAValidUrl('https://www.marist.edu/communication-arts/faculty/' + nameURL)) {
        return ('https://www.marist.edu/communication-arts/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/computer-science-math/faculty/' + nameURL)) {
        return ('https://www.marist.edu/computer-science-math/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/liberal-arts/faculty/' + nameURL)) {
        return ('https://www.marist.edu/liberal-arts/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/management/faculty/' + nameURL)) {
        return ('https://www.marist.edu/management/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/science/faculty/' + nameURL)) {
        return ('https://www.marist.edu/science/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/social-behavioral-science/faculty/' + nameURL)) {
        return ('https://www.marist.edu/social-behavioral-science/faculty/' + nameURL);
    }
    if (stringIsAValidUrl('https://www.marist.edu/professional-programs/faculty/' + nameURL)) {
        return ('https://www.marist.edu/professional-programs/faculty/' + nameURL);
    }
    return 'No valid URL found';
}


// Helper function for above
const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports.generateSalt = function(length = 16) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
  
module.exports.hashPassword = function(password, salt) {
    const sha256Hash = crypto.createHash('sha256');
    sha256Hash.update(password + salt);
    return sha256Hash.digest('hex');
}

// Set up the system for storing the files when uploaded
const storage = multer.diskStorage({
    // Set the upload destination to the uploads 
    destination: function(req, file, cb) {
        cb(null, path.join('./uploads'));
    },
    // Rename the image to the CWID of the user
    filename: function(req, file, cb) {
        cb(null, file.originalname.replace(`${req.params.userID}`));
    }
});
const upload = multer({storage: storage});
module.exports.upload = upload;