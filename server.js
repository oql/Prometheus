var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

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
                        //back to index page
                        eb.send('go.index', 'message', function(rpl){

                        });
                    } else{
                        console.log("###correct###");
                        //get user to main page
                        eb.send('go.main', 'message', function(rpl){
                            
                        });
                    }
                }
            );
        });
    } else if(req.uri() === "/signup"){
        console.log("--signup--");

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
                    //get user to main page
                }
            );
        });
    } else if(req.uri() === "/main"){
        req.response.sendFile("main.html");
    }

    eb.registerHandler('go.main', function(msg, replier){
        console.log("--got go.main event--");
        // req.response.write("<script>location.href='/main';</script>");
        replier(req.response.write("<script>location.href='/main';</script>"));
    });
}).listen(8080);
