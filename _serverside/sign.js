function signin(req){
    // get Form data by 'POST' method
    req.expectMultiPart(true);
    req.endHandler(function(){
        var attrs = req.formAttributes();
        var em = attrs.get("em");
        var pw = attrs.get("pw");

        // send query
        eb.send(
            'maria.io',
            {
                action: 'select',
                stmt: 'select * from user where email=?',
                values: [[em]]
            },
            function(msg){
                console.log('---sql status: '+msg.status+'---');

                if(msg.status=='error'){
                    console.log("---------------denied-------------------");
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                } else if(msg.result[0] == null){
                    console.log("--no user like that--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                } else if(pw != msg.result[0].password){
                    console.log("--incorrect!!--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                } else if(pw == msg.result[0].password){
                    console.log("###correct###");
                    var nk = msg.result[0].nickname;
                    createSession(req);
                }
            }
        );
    });
}
function signup(req){
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
                console.log('---sql status: '+msg.status+'---');
                if(msg.status == 'ok'){
                    createSession(req);
                } else {
                    console.log("---------------denied-------------------");
                    req.response.end("<script>location.href = '"+server['url']+"';</script>");
                }
            }
        );
    });
}
function signout(req){
    eb.send(
        'redis.io',
        {

        },
        function(msg){

        }
    );
}
function check_auth(req, cb, cb_inside){
    var uuid = getCookie(req);
    console.log("from cookie uuid is: "+uuid);
    eb.send(
        'redis.io',
        {
            command: "get",
            args: [uuid]
        },
        function(msg){
            if(msg.status == 'ok'){
                console.log("auth redis value : "+msg.value);
                if(msg.value == 'ok'){
                    eb.send(
                        'redis.io',
                        {
                            command: "expire",
                            args: [uuid, 10*60]
                        },
                        function(msg){
                            console.log("-----------"+msg.status+"----------");
                            cb(true, cb_inside);
                            console.log("after callback");
                        }
                    );
                }else{
                    cb(false, cb_inside);
                    console.log("after callback");
                }
            }
        }
    );
}

function cb_auth(auth, cb_inside){
    console.log("cb_auth called");
    cb_inside(auth);
}


function remove_user(req){
    eb.send(
        'maria.io',
        {

        },
        function(msg){

        }
    );
}

function createSession(req){
    uuid = generateUUID();
    console.log("------------"+uuid+"----------");
    eb.send(
        'redis.io',
        {
            command: "get",
            args: [uuid]
        },
        function(msg){
            console.log("----"+msg.value+"----");
            if(msg.value==null){
                eb.send(
                    'redis.io',
                    {
                        command: "set",
                        args: [uuid, 'ok']
                    },
                    function(msg){
                        if(msg.status == 'ok'){
                            eb.send(
                                'redis.io',
                                {
                                    command: "expire",
                                    args: [uuid, 10*60]
                                },
                                function(msg){
                                    console.log("-----------"+msg.status+"----------");
                                    setCookie(req, uuid);
                                    // req.response.putHeader('Set-Cookie','id=hi;HttpOnly');
                                    req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                                }
                            );
                        }else{
                            return createSession(req);
                        }
                    }
                );
            }else{
                return createSession(req);
            }
        }
    );
}

function setCookie(req, uuid){
    // req.response.putHeader('Set-Cookie','id=hi;HttpOnly');
    req.response.putHeader('Set-Cookie','id='+uuid+'; Path=/; HttpOnly; Secure');
    console.log("setcookie");
}
function getCookie(req){
    var header = req.headers();
    var cookie=header.get('Cookie');
    var uuid = null;

    if(cookie != null){
        cookie = cookie.split("=");
        for(var i in cookie){
            cookie[i].trim();
        }
        for(var i in cookie){
            if(cookie[i]=='id'){
                uuid = cookie[Number(i)+1];
            }
        }
        return uuid;
    }
    return null;
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
