var M = {
  v : 'v',
  f : function(){
    console.log(this.v);
  }
}

module.exports = M; //객체 M을 외부에서 사용할 수 있음
