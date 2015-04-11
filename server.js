var vertx = require("vertx");
var console = require("vertx/console");
var container = require('vertx/container');
var eb = require("vertx/event_bus");

container.deployVerticle("init_database.js");

var http = vertx.createHttpServer().requestHandler(function(req){
    if(req.uri() === "/"){
        console.log('--index--');
        req.response.sendFile("index.html");
    } else if(req.uri() === "/signin"){
        console.log("--signin--");
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
                    stmt: "select * from user where email="+"'em'"
                },
                function(msg){
                    console.log('--sql result--');
                    console.log('status: '+msg.status);
                    console.log(msg.result[0].pid);

                    // if(pw == msg.result.password){
                    //     console.log("###correct###");
                    //     // <script></script>
                    // }
                }
            );
        });
    } else if(req.uri() === "/signup"){
        console.log("--signup--");

        req.expectMultiPart(true);
        req.endHandler(function(){
            var attrs = req.formAttributes();
            eb.send(
                'mysql.test',
                {
                    action: 'insert',
                    stmt: "insert into t1(pid, name) values("+"3"+","+"'ketty'"+")"
                },
                function(msg){
                    console.log('--sql result--');
                    console.log('status: '+msg.status);

                    // SELECT
                    for(var i in msg.result){
                        console.log("pid: "+msg.result[i].pid + ", name: "+msg.result[i].name);
                    }
                    // console.log("pid: "+msg.result[0].pid+", name: "+msg.result[0].name);
                }
            );
        });
    }
}).listen(8080);
