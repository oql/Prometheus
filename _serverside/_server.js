var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");
// var timer = require("vertx/timer");
// var eb2 = require("vertx/event_bus");

load('config.js');
load("init_database.js");
load("mailer.js")
load("session.js");
load('sign.js');
load('static_file.js');
load('eb_register.js');

// create Http server that listen port number 8080
var httpserver = vertx.createHttpServer()
.requestHandler(function(req){
    console.log("############# request #############");
    // route user by their uri request
    switch(req.path()){
        case "/":
            check_auth(req, function(auth){
                console.log('auth(server.js): '+auth);
                if(auth==true){
                    req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
                }else if(auth==false){
                    req.response.sendFile("../_clientside/html/index.html");
                }
            });
            break;
        case "/signin":
            signin(req);    break;
        case "/signup":
            signup(req);    break;
        case "/signout":
            signout(req);   break;
        case "/ru":
            remove_user(req);
            break;
        case "/main":
            check_auth(req, function(auth){
                console.log('auth(server.js): '+auth);
                if(auth==true){
                    req.response.sendFile("../_clientside/html/main.html");
                }else if(auth==false){
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                }
            });
            break;
        case "/edit":
            req.response.sendFile("../_clientside/html/edit.html");     break;
        default:
            sendSrc(req);   break;
    }
})
.ssl(true)
.keyStorePath(server['keyStorePath'])
.keyStorePassword(server['keyStorePassword']);

// Create a SockJS bridge which lets everything through (be careful!)
vertx.createSockJSServer(httpserver).bridge({prefix: "/eventbus"},
[   // sent to
    {
    }
],
[   // coming to
    {
    }
]
);

httpserver.listen(server['port']);
