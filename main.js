var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
//refactoring - 같은 동작(내용)을 효율적으로 변형하는 것.
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');  //npm의 모듈 (입력된 데이터에 태그가 포함된 경우 태그를 삭제처리, 옵션(allowedTags)을 줌으로써 허용할 태그를 지정할 수 있다.)
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dlehdgmlpw',
  database : 'opentutorials'
});
db.connect();


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    var title = queryData.id;

    if(pathname ==='/'){
      if(queryData.id === undefined){
        db.query(`SELECT * FROM topic`,function(error,topics){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.html(title, list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        })
      }else{
        /*
        fs.readdir('./data',function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`,'utf8', function(err,description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.html(title, list,
              `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`);
                //버튼 클릭시 삭제 바로 수행돼야하므로 링크를 사용하면 안됨.. 링크타고 삭제할 수 있기 때문에
            response.writeHead(200);
            response.end(html); //출력할 페이지에 들어갈 내용
          });
      });
      */
     db.query(`SELECT * FROM topic`,function(error,topics){
       if(error){
         throw error;
       }
       db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error2,topic){
         if(error2){
           throw error2;
         }
         //쿼리 결과가 하나이더라도, 배열로 받아들이기 때문에 0번째임을 명시해줘야함.
         var title = topic[0].title;
         var description = topic[0].description;
         var list = template.list(topics);
         var html = template.html(title, list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>
         <a href="/update?id=${queryData.id}">update</a>
         <form action="delete_process" method="post">
           <input type="hidden" name="id" value="${queryData.id}">
           <input type="submit" value="delete">
         </form>`);
         response.writeHead(200);
         response.end(html);
        
      })
   })
    }
  }else if (pathname === '/create') {
    fs.readdir('./data',function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.html(title, list,`
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
      response.end(html); //출력할 페이지에 들어갈 내용
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
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`,'utf8', function(err,description){
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.html(title, list,`<form class="" action="/update_process" method="post">
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
        response.end(html); //출력할 페이지에 들어갈 내용
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
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`,function(error){
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
