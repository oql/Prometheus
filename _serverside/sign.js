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

                var nickname = msg.result[0].nickname;

                if(msg.result[0] == null){
                    console.log("--no user like that--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                    // return;
                }else if(pw != msg.result[0].password){
                    console.log("--incorrect!!--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                    // return;
                } else{
                    console.log("###correct###");
                    eb.send(
                        'redis.io',
                        {
                            // key should be hash code
                            command: "mset",
                            key: [nickname, em]
                        },
                        function(msg){
                            console.log('---redis status: '+msg.status+'---');
                            req.response.end("<script>location.href='"+server['url']+"/main';</script>");
                            // return;
                        }
                    );
                    // return;
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
                //
                eb2.send(
                    'redis.io',
                    {
                        // key should be hash code
                        command: "set",
                        args: [nk, em]
                    },
                    function(msg2){
                        console.log('---redis status: '+msg.status+'---');
                    }
                );
                //
                req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
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
