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

const Committee = sequelize.define ('Committees', {
    Committee_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    Committee_Name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = Committee;