load("wtf.js");
load("session.js");
var sesn = new session();

var conf_mail = {
    "address": "mail.io",
    "host": "localhost",
    "port": 25
};
container.deployModule("io.vertx~mod-mailer~2.0.0-final", conf_mail);


function mailer(){};

mailer.prototype.sendAuthMail = function(req){
    var owner = this;

    var code = null;
    var nk = null;
    var em = null;
    var uuid = sesn.getCookieUUID(req);

    wtf.heap([
        uuid
    ],
    [
        function(uuid, cb){
            eb.send(
                'redis.io',
                {
                    command: "get",
                    args: [uuid]
                },
                function(msg){
                    if(msg.value==null){
                        console.log("failed to get session(send_auth_mail()): ");
                    }else{
                        nk = msg.value;
                        cb(nk);
                    }
                }
            );
        },
        function(nk, cb){
            // remove user from database
            eb.send(
                'maria.io',
                {
                    action: 'select',
                    stmt: "select * from user where nickname=?",
                    values: [[nk]]
                },
                function(msg){
                    if(msg.status == 'ok'){
                        em = msg.result[0].email;
                        code = owner.generateCode();
                        cb();
                    }
                }
            );
        },
        function(cb){
            eb.send(
                'redis.io',
                {
                    command: "set",
                    args: [em, code]
                },
                function(msg){
                    if(msg.status == 'ok'){
                        cb();
                    }
                }
            );
        },
        function(cb){
            eb.send(
                'redis.io',
                {
                    command: "expire",
                    args: [em, server["sesn_lifetime"]]
                },
                function(msg){
                    console.log("email-code set in redis(sendAuthMail()): "+msg.status);
                    cb();
                }
            );
        },
        function(){
            eb.send(
                'mail.io',
                {
                    "from": "auth@ryunwake.com",
                    "to": em,
                    "subject": "Auth mail",
                    "body": code+""
                }
            );
        }
    ]);
};

mailer.prototype.checkMailCode = function(req){
    console.log("checkMailCode called -----------");
    req.expectMultiPart(true);
    req.endHandler(function(){
        var code = req.formAttributes().get("code");
        var em = null;
        var nk = null;
        var uuid = sesn.getCookieUUID(req);
        console.log("code(checkMailCode()): "+code);

        wtf.heap([
            uuid
        ],
        [
            function(uuid, cb){
                eb.send(
                    'redis.io',
                    {
                        command: "get",
                        args: [uuid]
                    },
                    function(msg){
                        nk = msg.value;
                        console.log("gotten nickname(checkMailCode()): "+ nk);
                        if( nk!= null){
                            cb(nk);
                        }else{
                            req.response.end("<script>location.href = '"+server['url']+"';</script>");
                        }
                    }
                );
            },
            function(nk, cb){
                eb.send(
                    'maria.io',
                    {
                        action: 'select',
                        stmt: "select * from user where nickname=?",
                        values: [[nk]]
                    },
                    function(msg){
                        if(msg.status == 'ok'){
                            em = msg.result[0].email;
                            console.log("gotten email(checkMailCode()): "+em);
                            cb(em);
                        }
                    }
                );
            },
            function(em, cb){
                eb.send(
                    'redis.io',
                    {
                        command: "get",
                        args: [em]
                    },
                    function(msg){
                        console.log("code value from redis(checkMailCode()): "+msg.value);
                        if(msg.value == code){
                            cb(nk);
                        }else{
                            req.response.end("<script>location.href = '"+server['url']+"';</script>");
                        }
                    }
                );
            },
            function(nk, cb){
                eb.send(
                    'maria.io',
                    {
                        action: 'update',
                        stmt: "update user set authed='true' where nickname=?",
                        values: [[nk]]
                    },
                    function(msg){
                        if(msg.status == 'ok'){
                            req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
                        }
                    }
                );
            }
        ]);
    });
};

mailer.prototype.generateCode = function(){
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
};
