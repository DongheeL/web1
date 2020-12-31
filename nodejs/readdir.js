var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);  //filelist에는 입력해준 폴더(여기서는 변수 testFolder) 하위에 있는 파일명이 배열로 저장됨.
});
