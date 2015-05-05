vertx = require("vertx");
container = require("vertx/container");
timer = require("vertx/timer");
eb = require("vertx/event_bus");

var conf_mail = {
    "address": 'mail.io',
    "host": 'localhost',
    "port": 25,
    // "ssl": <ssl>,
    // "auth": <auth>,
    // "username": <username>,
    // "password": <password>,
    // "content_type": <content_type>
};

var conf_gmail = {
    "address": "mail.io",
    "host": "localhost",
    "port": 25,
    // "ssl": true,
    // "auth": true,
    // "username": "cfr2ak@gmail.com",
    // "password": "skrxkrnswnwkdwkdaos312"
};

container.deployModule("io.vertx~mod-mailer~2.0.0-final", conf_gmail);

timer.setTimer(2000, function(){
    eb.send(
        'mail.io',
        {
            "from": "hi",
            "to": "gunjuly21@naver.com",
            "subject": "Congratulations on your new armadillo!",
            "body": "Dear Bob, great to here you have purchased......"
        }
    );
});
