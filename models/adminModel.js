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

const Admin = sequelize.define ('Admin', {
    Username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    Admin_Password: {
        type: DataTypes.STRING
    },
    Salt: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: "Admin_Login"
});

module.exports = Admin;