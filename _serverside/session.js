function session(){};

session.prototype.check_auth = function(req, cb){
    var owner = this;

    // get uuid cookie from client
    var uuid = owner.getCookieUUID(req);
    console.log("cookie from user, uuid(check_auth()):"+uuid);
    eb.send(
        'redis.io',
        {
            command: "get",
            args: [uuid]
        },
        function(msg){
            if(msg.status == 'ok'){
                console.log("auth redis value : "+msg.value);
                // regard user is authed if session is not null
                if(msg.value != null){
                    eb.send(
                        'redis.io',
                        {
                            command: "expire",
                            args: [uuid, server["sesn_lifetime"]]
                        },
                        function(msg){
                            console.log("session lifetime reset(check_auth()): "+msg.status);
                            cb(true, req);
                        }
                    );
                }else{
                    cb(false, req);
                }
            }
        }
    );
};

session.prototype.createSession = function(req, key_value){
    uuid = generateUUID();
    eb.send(
        'redis.io',
        {
            command: "get",
            args: [uuid]
        },
        function(msg){
            console.log("this should be null if uuid not exist(createSession()): "+msg.value);
            if(msg.value==null){
                eb.send(
                    'redis.io',
                    {
                        command: "set",
                        args: [uuid, key_value]
                    },
                    function(msg){
                        if(msg.status == 'ok'){
                            eb.send(
                                'redis.io',
                                {
                                    command: "expire",
                                    args: [uuid, server["sesn_lifetime"]]
                                },
                                function(msg){
                                    console.log("uuid set in redis(createSession()): "+msg.status);
                                    owner.setCookieUUID(req, uuid);
                                    // redirect to main page after set cookie
                                    req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                                }
                            );
                        }else{
                            // if set uuid failed, call itself again
                            return createSession(req, key_value);
                        }
                    }
                );
            }else{
                // if uuid is already exist, call itself again
                return createSession(req, key_value);
            }
        }
    );
};

session.prototype.removeSession = function(req){
    var owner = this;

    uuid = owner.getCookieUUID(req);
    if(uuid != null){
        eb.send(
            'redis.io',
            {
                command: "expire",
                args: [uuid, 0]
            },
            function(msg){
                console.log("uuid set in redis(createSession()): "+msg.status);
                owner.setCookieUUID(req, null);
                // redirect to main page after set cookie
                req.response.end("<script>location.href='"+server['url']+"';</script>");
            }
        );
    }
};

session.prototype.setCookieUUID = function(req, uuid){
    req.response.putHeader('Set-Cookie','uuid='+uuid+'; Path=/; HttpOnly; Secure');
    console.log("putHeader(setCookieUUID()): "+uuid);
};

session.prototype.getCookieUUID = function(req){
    var header = req.headers();
    var cookie=header.get('Cookie');
    var uuid = null;

    if(cookie != null){
        cookie = cookie.split("=");
        for(var i in cookie){
            cookie[i].trim();
        }
        for(var i in cookie){
            if(cookie[i]=='uuid'){
                uuid = cookie[Number(i)+1];
            }
        }
        return uuid;
    }else{
        // if cookie is null, return null
        return null;
    }
};

session.prototype.generateUUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    console.log("generated uuid(createSession()): "+uuid);
    return uuid;
};
