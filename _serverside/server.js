var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

var rm = new vertx.RouteMatcher();

container.deployVerticle("init_database.js");

// rm.get('/', function(req){
//     req.response.sendFile("index.html");
// });
// rm.get('/signin', function(req){
//     req.response.sendFile("signin.html");
//
//     //get Form data by 'POST' method
//     req.expectMultiPart(true);
//     req.endHandler(function(){
//         var attrs = req.formAttributes();
//         var em = attrs.get("em");
//         var pw = attrs.get("pw");
//
//         q_signin("select * from user where email='"+em+"'", pw);
//         // req.response().end("<script>location.href = 'https://www.google.co.kr';</script>")
//         // req.response.putTrailer("Location", "https://www.google.co.kr");
//     });
// });
// rm.get('/signup', function(req){
//     req.response.sendFile("edit.html");
//
//     //get Form data by 'POST' method
//     req.expectMultiPart(true);
//     req.endHandler(function(){
//         var attrs = req.formAttributes();
//         var em = attrs.get("em");
//         var pw = attrs.get("pw");
//         var nk = attrs.get("nk");
//
//         q_signup("insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')");
//     });
// });
// rm.get('/main', function(req){
//     req.response.sendFile("main.html");
// });


//create Http server that listen port number 8080
var http = vertx.createHttpServer()
.websocketHandler(function(ws){
    //websocket handling
})
.requestHandler(function(req){
    //route user by their uri
    if(req.uri() === "/"){
        req.response.sendFile("../_clientside/index.html");
    } else if(req.uri() === "/signin"){
        //get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");

            eb.send(
                'mysql.test',
                {
                    action: 'select',
                    stmt: "select * from user where email='"+em+"'"
                },
                function(msg){
                    console.log('---sql status: '+msg.status+'---');

                    if(pw != msg.result[0].password){
                        console.log("--incorrect!!--");
                        req.response.end("<script>location.href = 'http://localhost:8080/';</script>");
                    } else{
                        console.log("###correct###");
                        req.response.end("<script>location.href = 'http://localhost:8080/main';</script>");
                    }
                }
            );
        });
    } else if(req.uri() === "/signup"){
        //get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");
            var nk = attrs.get("nk");

            eb.send(
                'mysql.test',
                {
                    action: 'insert',
                    stmt: "insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')"
                },
                function(msg){
                    console.log('---sql status: '+msg.status+'---');
                    req.response.end("<script>location.href = 'http://localhost:8080/main';</script>");
                }
            );
        });
    } else if(req.uri() === "/main"){
        req.response.sendFile("../_clientside/main.html");
    }
}).listen(8080);
// .requestHandler(rm).listen(8080);
