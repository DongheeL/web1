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
      db.query(`SELECT * FROM topic`,function(error,topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id],function(error2,topic){
          if(error2){
            throw error2;
          }
          //쿼리 결과가 하나이더라도, 배열로 받아들이기 때문에 0번째임을 명시해줘야함.
          console.log(topic);
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.html(title, list,`<h2>${title}</h2>
          ${description}
          <p>by ${topic[0].name}</p>`,
          `<a href="/create">create</a>
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
    db.query(`SELECT * FROM topic`,function(error,topics){
      db.query('SELECT * FROM author',function(error2, authors){
        console.log(authors);
 
        var title = 'Create';
        var list = template.list(topics);
        var html = template.html(title, list,`
        <form class="" action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p> 
            <input type="submit">
          </p>
        </form>
        `,`<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      })
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
      db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,?,NOW(),?)`,[title,description,post.author],
      function(error, results){
        if(error){
          throw error;
        }
        response.writeHead(302,{Location:`/?id=${results.insertId}`});
        response.end();
      })
    });
  }else if (pathname==='/update') {
   db.query(`SELECT * FROM topic`,function(error,topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error2,topic){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM author',function(error2, authors){
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.html(title, list,`<form class="" action="/update_process" method="post"> 
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          ${template.authorSelect(authors,topic[0].author_id)}
        </p>
        <p>
          <input type="submit">
        </p>
        </form>`,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });
  })
  }else if (pathname === '/update_process') {
    var body = '';
    request.on('data',function (data) {
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var id = post.id; //update에서 id값으로 보낸 데이터 확인할 것
      console.log(id);
      var title = post.title;
      var description = post.description;
      db.query(`UPDATE topic SET title = ?, description = ?, author_id=? WHERE id = ?`,[title,description,post.author,id],
      function(error, results){
        if(error){
          throw error;
        }
        response.writeHead(302,{Location:`/?id=${id}`});
        response.end();
      })
    });
  }else if (pathname === '/delete_process') {
      var body = '';
      request.on('data',function (data) {
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`,[post.id],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302,{Location:`/`});
          response.end();
        })
      });
    }else{
      response.writeHead(404);
      response.end('Not found');
  }

});
app.listen(3000);
