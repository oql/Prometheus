var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");
var timer = require("vertx/timer");
// var eb2 = require("vertx/event_bus");

load('config.js');
load("init_database.js");
load('sign.js');
load('static_file.js');
load('eb_register.js');

// create Http server that listen port number 8080
var httpserver = vertx.createHttpServer()
.requestHandler(function(req){
    // route user by their uri request
    switch(req.path()){
        case "/":
        req.response.sendFile("../_clientside/html/index.html");    break;
        case "/signin":
        signin(req, eb);    break;
        case "/signup":
        signup(req);    break;
        case "/signout":
        signout(req);   break;
        case "/main":
        req.response.sendFile("../_clientside/html/Main.html");     break;
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
