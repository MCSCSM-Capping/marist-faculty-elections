const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize('FacultyElectionsDB', 'root', 'example', {
    host:'db',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection to \"FacultyElectionsDB\" (MySQL) established successfully.');
}).catch ((error) => {
    console.error('Unable to connect to the database:', error);
});

const User = sequelize.define("User", {
    //Define attributes
    CWID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    RecActive: {
        type: DataTypes.ENUM("Y", "N"),
        allowNull: false
    },
    First_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Last_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Preferred_Name: {
        type: DataTypes.STRING
    },
    Service_Statement: {
        type: DataTypes.STRING
    },
    Candidate_Statement: {
        type: DataTypes.STRING
    },
    School_Name: {
        type: DataTypes.ENUM("School of Communication and the Arts", 
        "School of Computer Science and Mathematics", "School of Liberal Arts", "School of Management", "School of Science", 
        "School of Social and Behavioural Sciences", "School of Professional Programs")
    },
    Is_On_Committee: {
        type: DataTypes.BOOLEAN
    },
    Website_URL: {
        type: DataTypes.STRING
    }

}, {
    //delibrate table name used in Database
    tableName: "Faculty",

    timestamps: false
});

module.exports = User;