var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
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
  ${control}
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
          var template = templateHTML(title, list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template); //출력할 페이지에 들어갈 내용
        })
      }else{
        fs.readdir('./data',function(error, filelist){
          fs.readFile(`data/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list,
              `<h2>${title}</h2><p>${description}</p>`,
              ` <a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                </form>`);
                //버튼 클릭시 삭제 바로 수행돼야하므로 링크를 사용하면 안됨.. 링크타고 삭제할 수 있기 때문에
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
      `,'');
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
      fs.writeFile(`data/${title}`,description,'utf8',function (err) {
        response.writeHead(302,{Location: `/?id=${title}`});  //redirect
        response.end();
      })
    });
  }else if (pathname==='/update') {
    fs.readdir('./data',function(error, filelist){
      fs.readFile(`data/${queryData.id}`,'utf8', function(err,description){
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list,`<form class="" action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(template); //출력할 페이지에 들어갈 내용
      });
  });
}else if (pathname === '/update_process') {
    var body = '';
    request.on('data',function (data) {
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      console.log(post);
      fs.rename(`data/${id}`,`data/${title}`,function(error){
        fs.writeFile(`data/${title}`,description,'utf8',function (err) {
          response.writeHead(302,{Location: `/?id=${title}`});  //redirect
          response.end();
        })
      });
    });
  }else if (pathname === '/delete_process') {
      var body = '';
      request.on('data',function (data) {
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`,function(error){
          response.writeHead(302,{Location: `/`});  //redirect
          response.end();
        })
      });
    }else{
      response.writeHead(404);
      response.end('Not found');
  }

});
app.listen(3000);
