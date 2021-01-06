var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  <a href="/create">create</a>
  ${body}
  </body>
  </html>
  `;
}
function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i<filelist.length){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += '</ul>';
  return list;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    var title = queryData.id;

    if(pathname ==='/'){
      if(queryData.id === undefined){

        fs.readdir('./data',function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list,`<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template); //출력할 페이지에 들어갈 내용
        })
      }else{
        fs.readdir('./data',function(error, filelist){
          fs.readFile(`data/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list,`<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template); //출력할 페이지에 들어갈 내용
          });
      });
    }
  }else if (pathname === '/create') {
    fs.readdir('./data',function(error, filelist){
      var title = 'WEB - create';
      var list = templateList(filelist);
      var template = templateHTML(title, list,`
        <form class="" action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `);
      response.writeHead(200);
      response.end(template); //출력할 페이지에 들어갈 내용
    })
  }else if (pathname === '/create_process') {
    var body = '';
    request.on('data',function (data) {
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      console.log(post);
    });
    response.writeHead(404);
    response.end('success');
  }else{
      response.writeHead(404);
      response.end('Not found');
  }

});
app.listen(3000);
