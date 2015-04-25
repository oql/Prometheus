function signin(req){
    // get Form data by 'POST' method
    req.expectMultiPart(true);
    req.endHandler(function(){
        var attrs = req.formAttributes();
        var em = attrs.get("em");
        var pw = attrs.get("pw");
        // var nk = attrs.get("nk");
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

                if(msg.result[0] == null){
                    console.log("--no user like that--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                }else if(pw != msg.result[0].password){
                    console.log("--incorrect!!--");
                    req.response.end("<script>location.href='"+server['url']+"';</script>");
                } else{
                    console.log("###correct###");
                    req.response.end("<script>location.href='"+server['url']+"/main';</script>");
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
                req.response.end("<script>location.href = '"+server['url']+"/main';</script>");
            }
        );
    });
}
