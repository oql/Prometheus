const url = "http://localhost";

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
            'mysql.test',
            {
                action: 'select',
                stmt: "select * from user where email='"+em+"'"
            },
            function(msg){
                console.log('---sql status: '+msg.status+'---');

                if(pw != msg.result[0].password){
                    console.log("--incorrect!!--");
                    req.response.end("<script>location.href='"+url+"';</script>");
                } else{
                    console.log("###correct###");
                    req.response.end("<script>location.href='"+url+"/main';</script>");
                }
            }
        );
        return [em, nk];
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
            'mysql.test',
            {
                action: 'insert',
                stmt: "insert into user(email, password, nickname) values('"+em+"','"+pw+"','"+nk+"')"
            },
            function(msg){
                console.log('---sql status: '+msg.status+'---');
                req.response.end("<script>location.href = '"+url+"main';</script>");
            }
        );
    });
}
