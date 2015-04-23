var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

load('config.js');
load('sign.js');

eb.registerHandler("ctos.text", function(msg){
    console.log("get published ctos.text");
    var title = msg['title'];
    var text = msg['text'];
    eb.send(
        'mysql.test',
        {
            action: 'insert',
            stmt: "insert into documents(title, text) values ('"+title+"','"+text+"')"
        },
        function(msg){
            console.log('---sql status: '+msg.status+'---');
        }
    );
});

// create Http server that listen port number 8080
var httpserver = vertx.createHttpServer()
.requestHandler(function(req){
    // route user by their uri request
    switch(req.path()){
    case "/":
        req.response.sendFile("../_clientside/html/index.html");    break;
    case "/signin":
        signin(req);    break;
    case "/signup":
        signup(req);    break;
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

function sendSrc(req){
    if(req.path().match(/.*.css/)){             // css request handler
        var file = req.path();
        req.response.putHeader("Content-Type", "text/css");
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.png/)){      // resource request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.js/)){       // javascript request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else{                                     // page and resource not found(404)
        req.response.sendFile("../_clientside/html/404NF.html");
    }
}

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
