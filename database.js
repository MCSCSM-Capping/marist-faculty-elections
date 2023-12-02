const { Sequelize, QueryTypes } = require('sequelize');
const mysql = require('mysql2');

//Import models
const User = require('./models/userModel');
const School = require('./models/schoolModel');
const Committee = require('./models/committeeModel');
const FacultyCommitteeJunction = require('./models/facultyCommitteeJunction')
const Admin = require('./models/adminModel');

//Connect to database
const sequelize = new Sequelize('FacultyElectionsDB', 'root', 'example', {
    host:'db',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection to \"FacultyElectionsDB\" (MySQL) established successfully.');
}).catch ((error) => {
    console.error('Unable to connect to the database:', error);
});

User.belongsToMany(Committee, {through: FacultyCommitteeJunction, foreignKey: 'CWID'});
Committee.belongsToMany(User, {through: FacultyCommitteeJunction, foreignKey: 'Committee_ID'});

module.exports = {
    // Gets the users with given options
    getUsers: async (options = {}) => User.findAll(options),

    //getSchools: async (options = {}) => School.findAll(options),

    getCommittees: async (options = {}) => Committee.findAll(options),

    getCredentials: async (options = {}) => Admin.findAll(options),

    getFacultyCommittees: async (CWID) => sequelize.query(`
    SELECT Committees.Committee_ID, Committees.Committee_Name
    FROM Committees
    JOIN Faculty_Committees ON (Faculty_Committees.Committee_ID = Committees.Committee_ID)
    JOIN Faculty ON (Faculty_Committees.CWID = Faculty.CWID)
    WHERE Faculty.CWID = ${CWID}`, {type: QueryTypes.SELECT})
}