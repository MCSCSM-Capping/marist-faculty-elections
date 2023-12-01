const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

//Import models
const User = require('./models/userModel');
const School = require('./models/schoolModel');
const Committee = require('./models/committeeModel');
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

module.exports = {
    // Gets the users with given options
    getUsers: async (options = {}) => User.findAll(options),

    //getSchools: async (options = {}) => School.findAll(options),

    getCommittees: async (options = {}) => Committee.findAll(options),

    getCredentials: async (options = {}) => Admin.findAll(options)
}