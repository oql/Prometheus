var container = require('vertx/container');
var eb = require("vertx/event_bus");

var config={
    address:'mysql.test',
    driver:'com.mysql.jdbc.Driver',
    url:'jdbc:mysql://localhost:3306/test',
    username:'root',
    password:'321654',
    database:'test'
};

container.deployModule('com.bloidonia~mod-jdbc-persistor~2.1', config);
