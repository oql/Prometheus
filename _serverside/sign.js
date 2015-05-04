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
                    createSession(nk, req);
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
                    createSession(nk, req);
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
function check_auth(req){
    eb.send(
        'redis.io',
        {

        },
        function(msg){

        }
    );
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

function createSession(nk, req){
    uuid = generateUUID();
    console.log("------------"+uuid+"----------");
    eb.send(
        'redis.io',
        {
            command: "set",
            args: [nk, 'ok']
        },
        function(msg){
            if(msg.status == 'ok'){
                eb.send(
                    'redis.io',
                    {
                        command: "expire",
                        args: [nk, 10]
                    },
                    function(msg){
                        console.log("-----------"+msg.status+"----------");
                        req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                    }
                );
            }
        }
    );
}

function generateUUID() {
    var d = new Date().getTime();
    console.log("-----------"+d+"------------");
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
