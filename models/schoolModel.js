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

const School = sequelize.define('School', {
    School_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    School_Name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = School;
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

const School = sequelize.define ('School', {
    School_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    School_Name: {
        type: DataTypes.STRING
    }
}, {
        timestamps: false
});

module.exports = School;