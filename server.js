var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

load("queryset.js");

var http = vertx.createHttpServer().requestHandler(function(req){
    if(req.uri() === "/"){
        req.response.sendFile("index.html");
    } else if(req.uri() === "/signin"){
        req.response.sendFile("edit.html");
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");

            q_signin("select * from user where email='"+em+"'", pw);
        });
    } else if(req.uri() === "/signup"){
        req.response.sendFile("edit.html");
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");
            var nk = attrs.get("nk");

            query("insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')");
        });
    } else if(req.uri() === "/main"){
        req.response.sendFile("main.html");
    }

    // eb.registerHandler('go.main', function(msg, replier){
    //     console.log("--got go.main event--");
    //     // req.response.write("<script>location.href='/main';</script>");
    //     replier(req.response.write("<script>location.href='/main';</script>"));
    // });
}).listen(8080);
