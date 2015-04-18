var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

// create Http server that listen port number 8080
var http = vertx.createHttpServer()
.websocketHandler(function(ws){
    // websocket handling
})
.requestHandler(function(req){
    // route user by their url request
    if(req.path() === "/"){
        req.response.sendFile("../_clientside/html/index.html");
    } else if(req.path() === "/signin"){
        // get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");
            // send query
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
                        req.response.end("<script>location.href = 'http://ryunwake.com/';</script>");
                    } else{
                        console.log("###correct###");
                        req.response.end("<script>location.href = 'http://ryunwake.com/main';</script>");
                    }
                }
            );
        });
    } else if(req.path() === "/signup"){
        // get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");
            var nk = attrs.get("nk");
            // send query
            eb.send(
                'mysql.test',
                {
                    action: 'insert',
                    stmt: "insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')"
                },
                function(msg){
                    console.log('---sql status: '+msg.status+'---');
                    req.response.end("<script>location.href = 'http://ryunwake.com/main';</script>");
                }
            );
        });
    } else if(req.path() === "/main"){
        req.response.sendFile("../_clientside/html/Main.html");
    } else if(req.path().match(/.*.css/)){
        // css request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.png/)){
        // resource request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.js/)){
        // javascript request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    }
}).listen(80);
