// Function to check if user logging in is not a student
module.exports.userIsFaculty = function(req, cas) {
    if (req.session[ cas.session_info ].employeetype === "STUDENT") {
        return false;
    } else {
        return true;
    }
}


// Function to create a new user
module.exports.createUser = function(req, cas) {
    
}