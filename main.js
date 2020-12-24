var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
    console.log('id = '+queryData.id);
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);

    response.end(queryData.id); //출력할 페이지에 들어갈 내용

});
app.listen(3000);
