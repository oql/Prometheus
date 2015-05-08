var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

load('config.js');
load("init_database.js");
load('static_file.js');
load('eb_register.js');

load("mailer.js");
var m = new mailer();
load("session.js");
var sesn = new session();
load('sign.js');
var sg = new sign();

// create Http server that listen port number 8080
var httpserver = vertx.createHttpServer()
.requestHandler(function(req){
    console.log("############# request #############");
    // route user by their uri request
    switch(req.path()){
        case "/":
            sesn.check_auth(req, function(auth){
                console.log('auth(server.js): '+auth);
                if(auth==true){
                    req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
                }else if(auth==false){
                    req.response.sendFile("../_clientside/html/index.html");
                }
            });
            break;
        case "/signin":
            sg.signin(req);    break;
        case "/signup":
            sg.signup(req);    break;
        case "/signout":
            sg.signout(req);   break;
        case "/mailauth":
            sesn.check_auth(req, function(auth){
                console.log('auth(server.js): '+auth);
                if(auth==true){
                    m.sendAuthMail(req);
                    req.response.sendFile("../_clientside/html/auth.html");
                }else if(auth==false){
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                }
            });
            break;
        case "/checkcode":
            // check_auth(req, function(auth, req){
            //     console.log('auth(server.js): '+auth);
            //     if(auth==true){
            //         m.checkMailCode(req);
            //     }else if(auth==false){
            //         req.response.end("<script>location.href = '"+server['url']+"';</script>");
            //     }
            // });
            m.checkMailCode(req);
            break;
        case "/removeuser":
            sesn.remove_user(req);   break;
        case "/main":
            sesn.check_auth(req, function(auth){
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
