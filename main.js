var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname ==='/'){
      if(queryData.id === undefined){

        fs.readdir('./data',function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = '<ul>';
          var i = 0;
          while(i<filelist.length){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list += '</ul>';
          var template = `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template); //출력할 페이지에 들어갈 내용
        })
      }else{
        fs.readdir('./data',function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = '<ul>';
          var i = 0;
          while(i<filelist.length){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list += '</ul>';
          fs.readFile(`data/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template); //출력할 페이지에 들어갈 내용
          });
      });
    }
  }else{
      response.writeHead(404);
      response.end('Not found'); //출력할 페이지에 들어갈 내용
    }

});
app.listen(3000);
