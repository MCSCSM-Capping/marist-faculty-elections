//sequelize model for Faculty_Committees table
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

const FacultyCommitteeJunction = sequelize.define('Faculty_Committees', {
    CWID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Committee_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = FacultyCommitteeJunction;