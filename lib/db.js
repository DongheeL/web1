var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'dlehdgmlpw',
    database : 'opentutorials'
});
db.connect();
module.exports = db;