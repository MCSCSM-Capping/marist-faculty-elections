var conn = require('.../database.js')

export function getSchools(){
    conn.query("SELECT School_Name FROM Schools", (err, result) => {
        if (err) {
            res.status(500).send(null);
            throw err;
        } else {
            res.status(200).send(JSON.stringify(result[0]));
            console.log(result[0]);
        }
    });
}

export function getCommittees(){

}