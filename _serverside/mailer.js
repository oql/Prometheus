var conf_mail = {
    "address": "mail.io",
    "host": "localhost",
    "port": 25
};

container.deployModule("io.vertx~mod-mailer~2.0.0-final", conf_mail);


function sendAuthMail(req){
    var code = null;
    var nk = null;
    var em = null;
    var uuid = getCookieUUID(req);
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
                            code = generateCode();
                            eb.send(
                                'redis.io',
                                {
                                    command: "set",
                                    args: [em, code]
                                },
                                function(msg){
                                    if(msg.status == 'ok'){
                                        eb.send(
                                            'redis.io',
                                            {
                                                command: "expire",
                                                args: [em, server["sesn_lifetime"]]
                                            },
                                            function(msg){
                                                console.log("email-code set in redis(sendAuthMail()): "+msg.status);
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
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
}

function checkMailCode(req){
    console.log("from here is checkMailCode==============");
    req.expectMultiPart(true, function(){
        var attrs = req.formAttributes();
    });
    req.endHandler(function(){
        console.log("here is endhandler====================");
        var code = attrs.get("code");
        var em = null;
        var nk = null;
        var uuid = getCookieUUID(req);
        eb.send(
            'redis.io',
            {
                command: "get",
                args: [uuid]
            },
            function(msg){
                nk = msg.value;
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
                            eb.send(
                                'redis.io',
                                {
                                    command: "get",
                                    args: [em]
                                },
                                function(msg){
                                    if(msg.value == code){
                                        eb.send(
                                            'maria.io',
                                            {
                                                action: 'update',
                                                stmt: "update user set(authed='true') where nickname=?",
                                                value: [[nk]]
                                            },
                                            function(msg){
                                                if(msg.status == 'ok'){
                                                    req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        );
    });
}

function generateCode(){
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}