// fix this file when fully understand callback function
// #####################################################

// function q_signin(q, pw){
//     var ac = q.split(' ')[0];
//
//     var is_right;
//     eb.send(
//         'mysql.test',
//         {
//             action: ac,
//             stmt: q
//         },
//         function(msg){
//             console.log('---sql status: '+msg.status+'---');
//
//             if(pw != msg.result[0].password){
//                 console.log("--incorrect!!--");
//                 //back to index page
//             } else{
//                 console.log("###correct###");
//                 //get user to main page
//             }
//         }
//     );
//     return is_right;
// }

// trying double callback
// ######################
// function q_signin(q, pw, fn){
//     var ac = q.split(' ')[0];
//
//     var is_right;
//     eb.send(
//         'mysql.test',
//         {
//             action: ac,
//             stmt: q
//         },
//         fn()
//     );
// }


// function q_signup(q){
//     var ac = q.split(' ')[0];
//     eb.send(
//         'mysql.test',
//         {
//             action: ac,
//             stmt: q
//         },
//         function(msg){
//             console.log('---sql status: '+msg.status+'---');
//             //get user to main page
//         }
//     );
// }
