var fs = require('fs');

/*
//readFileSync - 동기(순차적 진행)
console.log('A');
var result = fs.readFileSync('syntax/sample.txt','utf8');
console.log(result);
console.log('C');
//실행결과 ABC
*/

//asyncronous - 비동기
console.log('A');
fs.readFile('syntax/sample.txt','utf8', function(err, result){
  console.log(result);
});
console.log('C');
//실행결과 ACB
