function q_signin(q, pw){
    var ac = q.split(' ')[0];

    var is_right;
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
                is_right = false;
            } else{
                console.log("###correct###");
                //get user to main page
                is_right = true;
            }
        }
    );
    return is_right;
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
