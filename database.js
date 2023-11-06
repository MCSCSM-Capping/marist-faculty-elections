const mysql = require('mysql');
//const mysql = require('mysql2');
const connection = mysql.createConnection({
    //host: "localhost:3000",
    host: "localhost",
    user: "root",
    password: "example",
    database: "FacultyElectionsDB",
});

function query(queryStr, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        connection.query(queryStr, function(err, results) {
            connection.release(); // always put connection back in pool after last query
            if (err){
                    console.log(err);
                    return callback(err);
                }
            callback(null, results);
        });
    });
}

module.exports.query = query;