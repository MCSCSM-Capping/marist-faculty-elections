# Models
The models here are designed to help facilitate Object-Relational Mapping (ORM) to more easily manipulate data from the MySQL database on both the server side and the client side.

Models act as a "template" for an object to be created.

## Sequelize
In order to use ORM with Node.js, the project uses Sequelize.

Sequelize models work by templating the table within the MySQL database. In order to use all of the database, models were created for Admin_Login, Faculty, Committees, and even the junction table Faculty_Committees.

The models are defined in JSON format, which in turn is how the JSON object will be formatted when created by Sequelize's various finder functions. 

Sequelize is also capable of creating tables automatically based on models it is given. This project does not use this functionality, and instead maps the models to an already existing database with tables set up.

For more information on Sequelize: https://sequelize.org/
