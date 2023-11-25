// Function to check if user logging in is not a student
module.exports.userIsFaculty = function(req, cas) {
    if (req.session[ cas.session_info ].employeetype === "STUDENT") {
        return false;
    } else {
        return true;
    }
}

// Function for getting the current user that is logged in
module.exports.getCurrentUser = function(req) {
    // Create the user object
    const curUser = {
      id: (req.session.user) ? 1 : 0,
  };
  // If there is an error, get the error information and reset the session 
  if (req.session.error) {
      curUser.id = -1;
      curUser.error = req.session.error;
      req.session.destroy();
  } else {
      // Get the logged in user's username
      curUser.username = req.session.user;
  }
  // Return the user data
  return curUser;
};


// Function to create a new user
module.exports.createUser = function(req, cas) {

}