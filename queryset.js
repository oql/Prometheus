function q_signin(q, pw){
    var ac = q.split(' ')[0];
    eb.send(
        'mysql.test',
        {
            action: ac,
            stmt: q
        },
        function(msg){
            console.log('---sql status: '+msg.status+'---');

            if(pw != msg.result[0].password){
                console.log("--incorrect!!--");
                //back to index page
                // eb.send('go.index', 'message', function(rpl){
                //
                // });
            } else{
                console.log("###correct###");
                //get user to main page
                // eb.send('go.main', 'message', function(rpl){
                //
                // });
            }
        }
    );
}

function q_signup(q){
    var ac = q.split(' ')[0];
    eb.send(
        'mysql.test',
        {
            action: ac,
            stmt: q
        },
        function(msg){
            console.log('---sql status: '+msg.status+'---');
            //get user to main page
        }
    );
}
