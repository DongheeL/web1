var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //url의 쿼리스트링(url에서 ?이하 부분)을 추출할 수 있다 .
    var title = queryData.id;
    console.log('id = '+queryData.id);
    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    var template = `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="colors.js"></script>
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <input type="button" value="night" onclick="nightDayHandler(this);">
    <ol>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>${title}</h2>
    <p><iframe width="473" height="266" src="https://www.youtube.com/embed/jSJM9iOiQ1g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>
    <p><a href="https://www.w3.org/TR/html51/" target="_blank" title="HTML5 specification">Hypertext Markup Language (HTML)</a> is the standard markup
    language for <strong>creating <u>web</u> pages</strong> and
    web applications. Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
    <img src="coding.jpg" width="100%"></p>
    <p style="margin-top:40px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.</p>
    <p><div id="disqus_thread"></div>
    <script>

    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://web1-r34x0uwvnj.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript></p>
    </body>
    </html>
    `;
    response.end(template); //출력할 페이지에 들어갈 내용

});
app.listen(3000);
