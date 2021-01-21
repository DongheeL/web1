var http = require('http');
var url = require('url');
var qs = require('querystring');
//refactoring - 같은 동작(내용)을 효율적으로 변형하는 것.
var template = require('./lib/template.js');
var db = require('./lib/db');
var topic = require('./lib/topic');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
  var pathname = url.parse(_url, true).pathname;
  console.log(pathname);

  if(pathname ==='/'){
    if(queryData.id === undefined){
      topic.home(request,response);
    }else{
      topic.page(request,response);
    }
  }else if (pathname === '/create') {
    topic.create(request,response);
  }else if (pathname === '/create_process') {
    topic.create_process(request,response);
  }else if (pathname==='/update') {
    topic.update(request,response);
  }else if (pathname === '/update_process') {
    topic.update_process(request,response);
  }else if (pathname === '/delete_process') {
      topic.delete_process(request,response);
  }else{
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);
