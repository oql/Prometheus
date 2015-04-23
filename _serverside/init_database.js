var container = require('vertx/container');

load("config.js");

var config={
    address:'mysql.test',
    driver:'com.mysql.jdbc.Driver',
    url:'jdbc:mysql://localhost:3306/test',
    username: database['user'],
    password: database['password'],
    database: database['database']
};

container.deployModule('com.bloidonia~mod-jdbc-persistor~2.1.3', config);
