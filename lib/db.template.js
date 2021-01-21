//버전관리엔 db.template.js파일을 사용하고, db.template.js파일을 복사해 db.js파일을 만들어 입력해 실제 서비스에서 사용.
var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});
db.connect();
module.exports = db;