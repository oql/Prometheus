var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

//load query functions( ex q_signin, q_signup )
load("queryset.js");

//create Http server that listen port number 8080
var http = vertx.createHttpServer().requestHandler(function(req){
    //route user by their uri
    if(req.uri() === "/"){
        req.response.sendFile("index.html");
    } else if(req.uri() === "/signin"){
        req.response.sendFile("signin.html");

        //get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");

            q_signin("select * from user where email='"+em+"'", pw);
        });
    } else if(req.uri() === "/signup"){
        req.response.sendFile("edit.html");

        //get Form data by 'POST' method
        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            var em = attrs.get("em");
            var pw = attrs.get("pw");
            var nk = attrs.get("nk");

            q_signup("insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')");
        });
    } else if(req.uri() === "/main"){
        req.response.sendFile("main.html");
    }
}).listen(8080);
