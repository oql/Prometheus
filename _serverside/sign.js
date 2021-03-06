load("session.js");
var sesn = new session();

function sign(){};

sign.prototype.signin = function(req){
    // get Form data by 'POST' method
    req.expectMultiPart(true);
    req.endHandler(function(){
        var attrs = req.formAttributes();
        var em = attrs.get("em");
        var pw = attrs.get("pw");
        var nk = attrs.get("nk");

        // send query
        eb.send(
            'maria.io',
            {
                action: 'select',
                stmt: 'select * from user where email=?',
                values: [[em]]
            },
            function(msg){
                console.log('maria status(signin()): '+msg.status);

                if(msg.status=='error'){
                    console.log("access denied(signin())");
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                } else if(msg.result[0] == null){
                    console.log("user not exist(signin())");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                } else if(pw != msg.result[0].password){
                    console.log("password incorrect(signin())");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                } else if(pw == msg.result[0].password){
                    console.log("password correct(signin())");
                    var nk = msg.result[0].nickname;
                    sesn.createSession(req, nk);
                }
            }
        );
    });
};

sign.prototype.signup = function(req){
    // get Form data by 'POST' method
    req.expectMultiPart(true);
    req.endHandler(function(){
        var attrs = req.formAttributes();
        var em = attrs.get("em");
        var pw = attrs.get("pw");
        var nk = attrs.get("nk");
        // send query
        eb.send(
            'maria.io',
            {
                action: 'insert',
                stmt: 'insert into user(email, password, nickname) values(?, ?, ?)',
                values: [[em, pw, nk]]
            },
            function(msg){
                console.log('maria status(signup())'+msg.status+'---');
                if(msg.status == 'ok'){
                    sesn.createSession(req, nk);
                } else {
                    console.log("access denied(signup())");
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                }
            }
        );
    });
};

sign.prototype.signout = function(req){
    // remove user from session
    sesn.removeSession(req);
};

sign.prototype.remove_user = function(req){
    var nk = null;
    var uuid = getCookieUUID(req);

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
                        console.log("failed to get session(remove_user()): ");
                        req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                    }else{
                        nk = msg.value;
                        cb();
                    }
                }
            );
        },
        function(cb){
            // remove user from database
            eb.send(
                'maria.io',
                {
                    action: 'execute',
                    stmt: "delete from user where nickname='"+nk+"'"
                },
                function(msg){
                    if(msg.status == 'ok'){
                        // remove user from session
                        console.log("remove user succeed(remove_user())");
                        sesn.removeSession(req);
                    } else {
                        console.log("remove user failed(remove_user())");
                        req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                    }
                }
            );
        }
    ]);
};
