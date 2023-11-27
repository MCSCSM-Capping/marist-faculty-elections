const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

// var pool = mysql.createPool({
//     host: "db",
//     user: "root",
//     password: "example",
//     database: "FacultyElectionsDB",
// });

//Import models
const User = require('./models/userModel');

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
}