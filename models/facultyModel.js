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

const Faculty = sequelize.define ('Faculty', {
    CWID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    RecActive: {
        type: DataTypes.STRING
    },
    First_Name: {
        type: DataTypes.STRING
    }, 
    Last_Name: {
        type: DataTypes.STRING
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
    School_ID: {
        type: DataTypes.INTEGER
    },
    Is_On_Committee: {
        type: DataTypes.BOOLEAN
    },
    Website_URL: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = Faculty;