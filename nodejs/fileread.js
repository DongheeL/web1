//The fs module enables interacting with the file system in a way modeled on standard POSIX functions.
var fs = require('fs');
          //읽을 파일의 디렉토리,
fs.readFile('nodejs/sample.txt', 'utf8' ,function(err,data){
  console.log(data);
});
