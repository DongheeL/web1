
var o = {
  v1 : 'v1',
  v2 : 'v2',
  f1 : function () {
    console.log(this.v1); //객체 안에 있는 함수가 객체내의 변수에 접근할 때 this.변수명 으로 접근할 수 있다.
  },
  f2 : function () {
    console.log(this.v2);
  }
}

o.f1();
o.f2();
