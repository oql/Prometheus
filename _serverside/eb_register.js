// save article
eb.registerHandler("ctos.text", function(msg){
    console.log("get published ctos.text");
    var title = msg['title'];
    var text = msg['text'];
    eb.send(
        'maria.io',
        {
            action: 'insert',
            stmt: 'insert into documents(title, text) values (?, ?)',
            values: [[title, text]]
        },
        function(msg){
            console.log('---sql status: '+msg.status+'---');
        }
    );
});

eb.registerHandler("ctos.srch", function(msg, cb){
    console.log("get published ctos.srch");
    var word = msg['word'];
    // eb.send(
    //     'maria.io',
    //     {
    //         action: 'insert',
    //         stmt: 'insert into documents(title, text) values (?, ?)',
    //         values: [[title, text]]
    //     },
    //     function(msg){
    //         console.log('---sql status: '+msg.status+'---');
    //     }
    // );






    var result = null;

    cb(result);
});
