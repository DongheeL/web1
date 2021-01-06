/*
function a() {
  console.log('A');
}
*/
var a = function () { //자바스크립트에서는 함수가 값일 수 있다.
  console.log('A');
}

function slowfunc(callback) {
  callback();
}

slowfunc(a);
