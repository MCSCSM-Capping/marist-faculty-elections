const mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "example",
//     database: "FacultyElectionsDB"
// });
  
// // con.connect(function(err) {
// //     if (err) throw err;
// //     console.log("Connected!");
// //     con.query("SELECT * FROM Schools", function (err, result) {
// //         if (err) throw err;
// //         console.log("Result: " + result);
// //     });
// // });

// function query(queryStr, callback) {
//     con.connect(function(err) {
//         if (err) throw err;
//         con.query(queryStr, function (err, result) {
//             if (err) throw err;
//             console.log("Result: " + result);
//         });
//     });
// }
//const mysql = require('mysql2');
var pool = mysql.createPool({
    //host: "localhost:3000",
    host: "db",
    user: "root",
    password: "example",
    database: "FacultyElectionsDB",
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
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